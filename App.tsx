import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Player, Match, MonthlyData, Group, BracketMatch, AppState } from './types';
import { PlayerRankingTable } from './components/PlayerRankingTable';
import { MonthView } from './components/MonthView';
import { MasterBracket } from './components/MasterBracket';
import { PreviousMonthRanking } from './components/PreviousMonthRanking';
import { MatchResultModal } from './components/MatchResultModal';
import { WoStatsTable } from './components/WoStatsTable';
import { LoginModal } from './components/Login';
import { parseScore, generateMasterBracket } from './utils/helpers';
import { INITIAL_STATE } from './utils/initialState';

import { TrophyIcon, TournamentIcon, CalendarIcon, UserSlashIcon, LogInIcon, LogOutIcon } from './components/icons';

type ActiveView = 'monthly' | 'master' | 'previous' | 'wo-stats';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [isAdmin, setIsAdmin] = useState(false);

  const [activeView, setActiveView] = useState<ActiveView>('monthly');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [selectedGroupMatch, setSelectedGroupMatch] = useState<Match | null>(null);
  const [selectedBracketMatch, setSelectedBracketMatch] = useState<BracketMatch | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'saving' | 'error'>('idle');

  // Load state from local initial state
  useEffect(() => {
    setAppState(INITIAL_STATE);
    setLoading(false);
    const loader = document.getElementById('initial-loader-container');
    if (loader) loader.style.display = 'none';
  }, []);

  const handleSaveState = useCallback((newState: AppState) => {
    setSaveStatus('saving');
    // Save to local React state, no persistence
    setAppState(newState);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 1500);
  }, []);
  
  const players = appState?.players || [];
  const monthlyData = appState?.monthlyData || [];
  const currentMonthIndex = appState?.currentMonthIndex ?? 0;
  const masterBracket = appState?.masterBracket || [];
  const currentMonth = monthlyData[currentMonthIndex];

  const allMatchesPlayed = useMemo(() => {
    if (!currentMonth) return false;
    return currentMonth.matches.every(m => m.winnerId !== null);
  }, [currentMonth]);

  const masterContenders = useMemo(() => {
    if (!players || players.length === 0) return [];
    const sorted = [...players].sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
      return a.name.localeCompare(b.name);
    });
    return sorted.slice(0, 16);
  }, [players]);
  
  const handleMatchClick = (match: Match | BracketMatch, type: 'group' | 'bracket') => {
      if (!isAdmin) return;
      if (type === 'group') {
          setSelectedGroupMatch(match as Match);
      } else {
          const bracketMatch = match as BracketMatch;
          if(bracketMatch.player1Id && bracketMatch.player2Id) {
             setSelectedBracketMatch(bracketMatch);
          }
      }
      setIsMatchModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsMatchModalOpen(false);
    setSelectedGroupMatch(null);
    setSelectedBracketMatch(null);
  };
  
  const handleSaveBracketResult = (
    matchToUpdate: BracketMatch, newWinnerId: number, newScore: string
  ) => {
    if (!appState) return;

    const { masterBracket: currentBracket } = appState;
    let updatedBracket = [...currentBracket];

    const matchIndex = updatedBracket.findIndex(m => m.id === matchToUpdate.id);
    if (matchIndex === -1) return;
    
    updatedBracket[matchIndex] = {
      ...updatedBracket[matchIndex],
      winnerId: newWinnerId,
      score: newScore
    };

    const nextMatch = updatedBracket.find(
      m => m.sourceMatch1Id === matchToUpdate.id || m.sourceMatch2Id === matchToUpdate.id
    );

    if (nextMatch) {
      const nextMatchIndex = updatedBracket.findIndex(m => m.id === nextMatch.id);
      const updatedNextMatch = { ...updatedBracket[nextMatchIndex] };

      if (updatedNextMatch.sourceMatch1Id === matchToUpdate.id) {
        updatedNextMatch.player1Id = newWinnerId;
      } else if (updatedNextMatch.sourceMatch2Id === matchToUpdate.id) {
        updatedNextMatch.player2Id = newWinnerId;
      }
      
      updatedBracket[nextMatchIndex] = updatedNextMatch;
    }
    
    const newState = { ...appState, masterBracket: updatedBracket };
    handleSaveState(newState);
    handleCloseModal();
  };

  const handleSaveGroupMatchResult = (
    matchToUpdate: Match, newWinnerId: number, newScore: string, newIsWO: boolean
  ) => {
    if (!appState) return;

    const { players: currentPlayers, monthlyData: currentMonthlyData } = appState;
    const originalMatch = currentMonth.matches.find(m => m.id === matchToUpdate.id);
    if (!originalMatch) return;

    // FIX: Explicitly type the Map to ensure correct type inference for players.
    const updatedPlayersMap = new Map<number, Player>(currentPlayers.map(p => [p.id, { ...p }]));
    
    // Revert previous result if one exists
    if (originalMatch.winnerId) {
      const oldWinnerId = originalMatch.winnerId;
      const oldLoserId = oldWinnerId === originalMatch.player1Id ? originalMatch.player2Id : originalMatch.player1Id;
      const oldWinner = updatedPlayersMap.get(oldWinnerId)!;
      const oldLoser = updatedPlayersMap.get(oldLoserId)!;
      const wasWO = originalMatch.isWO;

      if (wasWO) {
        oldWinner.totalWoWins -= 1;
        oldWinner.monthlyWoWins -= 1;
        oldLoser.totalWoLosses -= 1;
        oldLoser.monthlyWoLosses -= 1;
      }

      const oldSetCounts = parseScore(originalMatch.score, originalMatch.player1Id, originalMatch.player2Id);
      const oldWinnerSetPoints = oldSetCounts[oldWinnerId];
      const winnerPointsToRevert = (10 + 2 + oldWinnerSetPoints);

      oldWinner.wins -= 1; oldWinner.monthlyWins -= 1;
      oldWinner.gamesPlayed -= 1; oldWinner.monthlyGamesPlayed -= 1;
      oldWinner.pointsFromGames -= 2; oldWinner.monthlyPointsFromGames -= 2;
      oldWinner.setsWon -= oldSetCounts[oldWinnerId]; oldWinner.monthlySetsWon -= oldSetCounts[oldWinnerId];
      oldWinner.totalPoints -= winnerPointsToRevert; oldWinner.monthlyPoints -= winnerPointsToRevert;
      
      oldLoser.losses -= 1; oldLoser.monthlyLosses -= 1;
      oldLoser.gamesPlayed -= 1; oldLoser.monthlyGamesPlayed -= 1;
      
      if (!wasWO) {
          const oldLoserSetPoints = oldSetCounts[oldLoserId];
          const loserPointsToRevert = (2 + oldLoserSetPoints);
          oldLoser.pointsFromGames -= 2; oldLoser.monthlyPointsFromGames -= 2;
          oldLoser.setsWon -= oldSetCounts[oldLoserId]; oldLoser.monthlySetsWon -= oldSetCounts[oldLoserId];
          oldLoser.totalPoints -= loserPointsToRevert; oldLoser.monthlyPoints -= loserPointsToRevert;
      }
    }

    // Apply new result
    const newWinner = updatedPlayersMap.get(newWinnerId)!;
    const newLoserId = newWinnerId === matchToUpdate.player1Id ? matchToUpdate.player2Id : matchToUpdate.player1Id;
    const newLoser = updatedPlayersMap.get(newLoserId)!;

    if (newIsWO) { newWinner.totalWoWins += 1; newWinner.monthlyWoWins += 1; newLoser.totalWoLosses += 1; newLoser.monthlyWoLosses += 1; }
    
    const newSetCounts = parseScore(newScore, matchToUpdate.player1Id, matchToUpdate.player2Id);
    const winnerSetPoints = newSetCounts[newWinnerId];
    const winnerPointsToAdd = (10 + 2 + winnerSetPoints);

    newWinner.wins += 1; newWinner.monthlyWins += 1;
    newWinner.gamesPlayed += 1; newWinner.monthlyGamesPlayed += 1;
    newWinner.pointsFromGames += 2; newWinner.monthlyPointsFromGames += 2;
    newWinner.setsWon += newSetCounts[newWinnerId]; newWinner.monthlySetsWon += newSetCounts[newWinnerId];
    newWinner.totalPoints += winnerPointsToAdd; newWinner.monthlyPoints += winnerPointsToAdd;

    newLoser.losses += 1; newLoser.monthlyLosses += 1;
    newLoser.gamesPlayed += 1; newLoser.monthlyGamesPlayed += 1;
    if (!newIsWO) {
        const loserSetPoints = newSetCounts[newLoserId];
        const loserPointsToAdd = (2 + loserSetPoints);
        newLoser.pointsFromGames += 2; newLoser.monthlyPointsFromGames += 2;
        newLoser.setsWon += newSetCounts[newLoserId]; newLoser.monthlySetsWon += newSetCounts[newLoserId];
        newLoser.totalPoints += loserPointsToAdd; newLoser.monthlyPoints += loserPointsToAdd;
    }
    
    const newMonthlyData = [...currentMonthlyData];
    const currentMonthData = { ...newMonthlyData[currentMonthIndex] };
    currentMonthData.matches = currentMonthData.matches.map(m =>
        m.id === matchToUpdate.id ? { ...m, winnerId: newWinnerId, score: newScore, isWO: newIsWO } : m
    );
    newMonthlyData[currentMonthIndex] = currentMonthData;
    
    const newState = { ...appState, players: Array.from(updatedPlayersMap.values()), monthlyData: newMonthlyData };
    handleSaveState(newState);
    handleCloseModal();
  };

  const handleResetGroupMatchResult = (matchToReset: Match) => {
    if (!appState || !matchToReset.winnerId) return;

    const player1Name = players.find(p => p.id === matchToReset.player1Id)?.name;
    const player2Name = players.find(p => p.id === matchToReset.player2Id)?.name;

    if (!window.confirm(`Tem certeza que deseja resetar o resultado do jogo entre ${player1Name} e ${player2Name}?`)) return;

    const { players: currentPlayers, monthlyData: currentMonthlyData } = appState;
    // FIX: Explicitly type the Map to ensure correct type inference for players.
    const updatedPlayersMap = new Map<number, Player>(currentPlayers.map(p => [p.id, { ...p }]));
    
    // Revert points
    const oldWinnerId = matchToReset.winnerId;
    const oldLoserId = oldWinnerId === matchToReset.player1Id ? matchToReset.player2Id : matchToReset.player1Id;
    const oldWinner = updatedPlayersMap.get(oldWinnerId)!;
    const oldLoser = updatedPlayersMap.get(oldLoserId)!;
    const wasWO = matchToReset.isWO;

    if (wasWO) {
      oldWinner.totalWoWins -= 1; oldWinner.monthlyWoWins -= 1;
      oldLoser.totalWoLosses -= 1; oldLoser.monthlyWoLosses -= 1;
    }

    const oldSetCounts = parseScore(matchToReset.score, matchToReset.player1Id, matchToReset.player2Id);
    const oldWinnerSetPoints = oldSetCounts[oldWinnerId];
    const winnerPointsToRevert = (10 + 2 + oldWinnerSetPoints);

    oldWinner.wins -= 1; oldWinner.monthlyWins -= 1;
    oldWinner.gamesPlayed -= 1; oldWinner.monthlyGamesPlayed -= 1;
    oldWinner.pointsFromGames -= 2; oldWinner.monthlyPointsFromGames -= 2;
    oldWinner.setsWon -= oldSetCounts[oldWinnerId]; oldWinner.monthlySetsWon -= oldSetCounts[oldWinnerId];
    oldWinner.totalPoints -= winnerPointsToRevert; oldWinner.monthlyPoints -= winnerPointsToRevert;
    
    oldLoser.losses -= 1; oldLoser.monthlyLosses -= 1;
    oldLoser.gamesPlayed -= 1; oldLoser.monthlyGamesPlayed -= 1;
    
    if (!wasWO) {
        const oldLoserSetPoints = oldSetCounts[oldLoserId];
        const loserPointsToRevert = (2 + oldLoserSetPoints);
        oldLoser.pointsFromGames -= 2; oldLoser.monthlyPointsFromGames -= 2;
        oldLoser.setsWon -= oldSetCounts[oldLoserId]; oldLoser.monthlySetsWon -= oldSetCounts[oldLoserId];
        oldLoser.totalPoints -= loserPointsToRevert; oldLoser.monthlyPoints -= loserPointsToRevert;
    }
    
    const newMonthlyData = [...currentMonthlyData];
    const currentMonthData = { ...newMonthlyData[currentMonthIndex] };
    currentMonthData.matches = currentMonthData.matches.map(m =>
        m.id === matchToReset.id ? { ...m, winnerId: null, score: '', isWO: false } : m
    );
    newMonthlyData[currentMonthIndex] = currentMonthData;
    
    const newState = { ...appState, players: Array.from(updatedPlayersMap.values()), monthlyData: newMonthlyData };
    handleSaveState(newState);
    handleCloseModal();
  };
  
  const handleResetBracketMatchResult = (matchToReset: BracketMatch) => {
    if (!appState || !matchToReset.winnerId) return;
    if (!window.confirm(`Tem certeza que deseja resetar o resultado desta partida da chave?`)) return;

    const { masterBracket: currentBracket } = appState;
    let updatedBracket = [...currentBracket];

    const nextMatch = updatedBracket.find(
      m => m.sourceMatch1Id === matchToReset.id || m.sourceMatch2Id === matchToReset.id
    );

    if (nextMatch) {
      const nextMatchIndex = updatedBracket.findIndex(m => m.id === nextMatch.id);
      const updatedNextMatch = { ...updatedBracket[nextMatchIndex] };

      if (updatedNextMatch.winnerId) {
          alert("Não é possível resetar este jogo pois o jogo seguinte na chave já foi concluído.");
          return;
      }

      if (updatedNextMatch.sourceMatch1Id === matchToReset.id) {
        updatedNextMatch.player1Id = null;
      } else if (updatedNextMatch.sourceMatch2Id === matchToReset.id) {
        updatedNextMatch.player2Id = null;
      }
      
      updatedBracket[nextMatchIndex] = updatedNextMatch;
    }

    const matchIndex = updatedBracket.findIndex(m => m.id === matchToReset.id);
    if (matchIndex !== -1) {
        updatedBracket[matchIndex] = {
            ...updatedBracket[matchIndex],
            winnerId: null,
            score: '',
        };
    }
    
    const newState = { ...appState, masterBracket: updatedBracket };
    handleSaveState(newState);
    handleCloseModal();
  };

  const handleAdvanceMonth = () => {
    if (!appState) return;
    if (!allMatchesPlayed) {
        alert("Todos os jogos do mês devem ser concluídos antes de avançar.");
        return;
    }
    if (!window.confirm("Tem certeza que deseja avançar para o próximo mês? Esta ação criará novos grupos e não pode ser desfeita.")) {
        return;
    }
    
    const sortedPlayers = [...players].sort((a, b) => {
        if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
        return a.name.localeCompare(b.name);
    });
    
    const playersForNewMonth = players.map(p => ({ ...p, monthlyPoints: 0, monthlyWins: 0, monthlyLosses: 0, monthlyGamesPlayed: 0, monthlySetsWon: 0, monthlyPointsFromGames: 0, monthlyWoWins: 0, monthlyWoLosses: 0 }));
    const newMonthId = currentMonth.id + 1;
    const newGroups: Group[] = [];
    const newMatches: Match[] = [];
    const playersPerGroup = 4;
    const numGroups = Math.ceil(players.length / playersPerGroup);
    
    for (let i = 0; i < numGroups; i++) {
        const groupPlayerIds = sortedPlayers.slice(i * playersPerGroup, (i + 1) * playersPerGroup).map(p => p.id);
        const group: Group = { id: i + 1, name: `Grupo ${i + 1}`, playerIds: groupPlayerIds };
        newGroups.push(group);
        for (let j = 0; j < groupPlayerIds.length; j++) {
            for (let k = j + 1; k < groupPlayerIds.length; k++) {
                const p1Id = groupPlayerIds[j];
                const p2Id = groupPlayerIds[k];
                newMatches.push({ id: `m${newMonthId}-g${group.id}-p${p1Id}-vs-p${p2Id}`, player1Id: p1Id, player2Id: p2Id, winnerId: null, score: '', isWO: false });
            }
        }
    }
    
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const newMonthName = monthNames[(new Date().getMonth() + (currentMonthIndex)) % 12];
    const nextMonth: MonthlyData = { id: newMonthId, name: newMonthName, groups: newGroups, matches: newMatches };

    const newAppState: AppState = {
      ...appState,
      players: playersForNewMonth,
      monthlyData: [...appState.monthlyData, nextMonth],
      currentMonthIndex: appState.currentMonthIndex + 1,
      masterBracket: generateMasterBracket(masterContenders) // Reset master bracket
    };
    
    handleSaveState(newAppState);
  };

  const matchForModal = useMemo(() => {
    if (selectedGroupMatch) return { type: 'group', match: selectedGroupMatch };
    if (selectedBracketMatch) return { type: 'bracket', match: selectedBracketMatch };
    return null;
  }, [selectedGroupMatch, selectedBracketMatch]);
  
  const playersForModal = useMemo(() => {
    if (!matchForModal || !players) return null;
    const p1 = players.find(p => p.id === matchForModal.match.player1Id);
    const p2 = players.find(p => p.id === matchForModal.match.player2Id);
    if (!p1 || !p2) return null;
    return { player1: p1, player2: p2 };
  }, [matchForModal, players]);
  
  const SaveStatusIndicator = () => {
    switch(saveStatus) {
        case 'saving': return <span className="text-xs text-yellow-400">Salvando...</span>;
        case 'saved': return <span className="text-xs text-green-400">✔ Salvo</span>;
        case 'error': return <span className="text-xs text-red-400">Erro!</span>;
        default: return <span className="text-xs">&nbsp;</span>
    }
  }

  if (loading) {
    return null; // The initial loader in index.html will be shown
  }

  return (
    <div className="min-h-screen">
      <header className="bg-slate-800/80 backdrop-blur-sm p-4 shadow-lg sticky top-0 z-20">
          <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-cyan-400 text-center sm:text-left">Ranking Tatuí Cat B</h1>
              
              <div className="flex items-center space-x-2 bg-slate-700 p-1 rounded-lg">
                  <button onClick={() => setActiveView('monthly')} className={`px-3 py-1.5 text-sm font-semibold rounded-md flex items-center gap-2 transition-colors ${activeView === 'monthly' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-600/50'}`}><TrophyIcon className="w-4 h-4" />Ranking Mensal</button>
                  <button onClick={() => setActiveView('master')} className={`px-3 py-1.5 text-sm font-semibold rounded-md flex items-center gap-2 transition-colors ${activeView === 'master' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-600/50'}`}><TournamentIcon className="w-4 h-4" />Master</button>
                  <button onClick={() => setActiveView('previous')} className={`px-3 py-1.5 text-sm font-semibold rounded-md flex items-center gap-2 transition-colors ${activeView === 'previous' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-600/50'}`}><CalendarIcon className="w-4 h-4" />Meses Anteriores</button>
                  <button onClick={() => setActiveView('wo-stats')} className={`px-3 py-1.5 text-sm font-semibold rounded-md flex items-center gap-2 transition-colors ${activeView === 'wo-stats' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-600/50'}`}><UserSlashIcon className="w-4 h-4" />W.O.</button>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-4">
                 {isAdmin ? (
                   <>
                     <button onClick={() => setIsAdmin(false)} className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-slate-300 hover:bg-slate-600/50 rounded-md transition" title="Sair do Modo Admin">
                        <LogOutIcon className="w-4 h-4" />
                        <span>Sair</span>
                    </button>
                    <div className="relative w-28 text-center">
                      <span className="font-semibold text-lg">{currentMonth?.name}</span>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-full" aria-live="polite">
                          <SaveStatusIndicator />
                      </div>
                    </div>
                    <button onClick={handleAdvanceMonth} disabled={!allMatchesPlayed} className="px-4 py-2 rounded-md bg-cyan-600 text-white font-semibold hover:bg-cyan-500 disabled:bg-slate-500 disabled:cursor-not-allowed transition-all" title={!allMatchesPlayed ? "Conclua todos os jogos para avançar" : "Avançar para o próximo mês"}>Avançar Mês</button>
                   </>
                 ) : (
                    <>
                      <div className="w-28 text-center">
                        <span className="font-semibold text-lg">{currentMonth?.name || '...'}</span>
                      </div>
                      <button onClick={() => setIsLoginModalOpen(true)} className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-slate-300 hover:bg-slate-600/50 rounded-md transition">
                        <LogInIcon className="w-4 h-4" />
                        Admin Login
                      </button>
                    </>
                 )}
              </div>
          </div>
      </header>
      <main className="container mx-auto p-4 lg:p-6">
        {appState ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div className="lg:col-span-1 xl:col-span-1">
                <PlayerRankingTable players={players} />
            </div>
            <div className="lg:col-span-2 xl:col-span-3">
                {activeView === 'monthly' && currentMonth && <MonthView monthData={currentMonth} players={players} onMatchClick={(m) => handleMatchClick(m, 'group')} isAdmin={isAdmin} />}
                {activeView === 'master' && <MasterBracket players={players} contenders={masterContenders} bracketData={masterBracket} onMatchClick={(m) => handleMatchClick(m, 'bracket')} isAdmin={isAdmin}/>}
                {activeView === 'previous' && <PreviousMonthRanking />}
                {activeView === 'wo-stats' && <WoStatsTable players={players} />}
            </div>
            </div>
        ) : null}
      </main>
      
      {isLoginModalOpen && (
        <LoginModal 
            onClose={() => setIsLoginModalOpen(false)}
            onSuccess={() => {
                setIsAdmin(true);
                setIsLoginModalOpen(false);
            }}
        />
      )}

      {isMatchModalOpen && matchForModal && playersForModal && (
        <MatchResultModal
          match={{ ...matchForModal.match, isWO: matchForModal.type === 'group' ? (matchForModal.match as Match).isWO : false }}
          player1={playersForModal.player1}
          player2={playersForModal.player2}
          onClose={handleCloseModal}
          onSave={(_match, winnerId, score, isWO) => {
            if (matchForModal?.type === 'group') {
              handleSaveGroupMatchResult(matchForModal.match as Match, winnerId, score, isWO);
            } else if (matchForModal?.type === 'bracket') {
              handleSaveBracketResult(matchForModal.match as BracketMatch, winnerId, score);
            }
          }}
          onReset={() => {
            if (matchForModal?.type === 'group') {
              handleResetGroupMatchResult(matchForModal.match as Match);
            } else if (matchForModal?.type === 'bracket') {
              handleResetBracketMatchResult(matchForModal.match as BracketMatch);
            }
          }}
          isBracketMatch={matchForModal.type === 'bracket'}
        />
      )}
    </div>
  );
};

export default App;
