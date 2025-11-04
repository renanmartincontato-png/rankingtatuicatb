import { Player, Group, Match, MonthlyData, BracketMatch } from '../types';

export const SEPTEMBER_RANKING = [
    { name: "Caio Dias", games: 5, wins: 5, losses: 0, sets: 10, gamePoints: 10, total: 70 },
    { name: "Guilherme Tadini", games: 5, wins: 5, losses: 0, sets: 10, gamePoints: 10, total: 70 },
    { name: "Robson Fiusa", games: 5, wins: 5, losses: 0, sets: 10, gamePoints: 10, total: 70 },
    { name: "Claudio", games: 5, wins: 4, losses: 1, sets: 9, gamePoints: 10, total: 59 },
    { name: "Thiago Mello", games: 5, wins: 4, losses: 1, sets: 9, gamePoints: 10, total: 59 },
    { name: "Evaldo", games: 5, wins: 4, losses: 1, sets: 9, gamePoints: 10, total: 59 },
    { name: "Daniel Tomaz", games: 5, wins: 4, losses: 1, sets: 8, gamePoints: 10, total: 58 },
    { name: "Gustavo Granja", games: 5, wins: 4, losses: 1, sets: 8, gamePoints: 10, total: 58 },
    { name: "Lincoln", games: 5, wins: 4, losses: 1, sets: 8, gamePoints: 10, total: 58 },
    { name: "Pedro", games: 5, wins: 4, losses: 1, sets: 8, gamePoints: 10, total: 58 },
    { name: "Ary", games: 5, wins: 3, losses: 2, sets: 7, gamePoints: 10, total: 47 },
    { name: "Gabriel Abrame", games: 5, wins: 3, losses: 2, sets: 7, gamePoints: 10, total: 47 },
    { name: "José Eduardo", games: 5, wins: 3, losses: 2, sets: 7, gamePoints: 10, total: 47 },
    { name: "João Orsi", games: 5, wins: 3, losses: 2, sets: 7, gamePoints: 10, total: 47 },
    { name: "Cleiton", games: 5, wins: 3, losses: 2, sets: 6, gamePoints: 10, total: 46 },
    { name: "Diego Rodrigues", games: 5, wins: 3, losses: 2, sets: 6, gamePoints: 10, total: 46 },
    { name: "Mario", games: 5, wins: 3, losses: 2, sets: 6, gamePoints: 10, total: 46 },
    { name: "Leo Alves", games: 5, wins: 3, losses: 2, sets: 6, gamePoints: 10, total: 46 },
    { name: "Paulo Soares", games: 5, wins: 3, losses: 2, sets: 7, gamePoints: 8, total: 45 },
    { name: "Iramaia", games: 5, wins: 2, losses: 3, sets: 6, gamePoints: 10, total: 36 },
    { name: "Fernando Martin", games: 5, wins: 2, losses: 3, sets: 5, gamePoints: 10, total: 35 },
    { name: "Fernando Soares", games: 5, wins: 2, losses: 3, sets: 5, gamePoints: 10, total: 35 },
    { name: "Luiz Fernando", games: 5, wins: 2, losses: 3, sets: 5, gamePoints: 10, total: 35 },
    { name: "Marcelo Candido", games: 5, wins: 2, losses: 3, sets: 5, gamePoints: 10, total: 35 },
    { name: "Tiago Meira", games: 5, wins: 2, losses: 3, sets: 5, gamePoints: 10, total: 35 },
    { name: "Renan Martin", games: 5, wins: 2, losses: 3, sets: 5, gamePoints: 10, total: 35 },
    { name: "Luan", games: 5, wins: 2, losses: 3, sets: 4, gamePoints: 10, total: 34 },
    { name: "Marcos Rodrigues", games: 5, wins: 2, losses: 3, sets: 4, gamePoints: 10, total: 34 },
    { name: "Lucas Lima", games: 5, wins: 2, losses: 3, sets: 4, gamePoints: 8, total: 32 },
    { name: "Gilson Santana", games: 5, wins: 2, losses: 3, sets: 4, gamePoints: 8, total: 32 },
    { name: "Marcelo Bassi", games: 5, wins: 2, losses: 3, sets: 4, gamePoints: 4, total: 28 },
    { name: "Arthur", games: 5, wins: 1, losses: 4, sets: 4, gamePoints: 10, total: 24 },
    { name: "Flavio", games: 5, wins: 1, losses: 4, sets: 4, gamePoints: 10, total: 24 },
    { name: "Arildo", games: 5, wins: 1, losses: 4, sets: 3, gamePoints: 10, total: 23 },
    { name: "Joao Claudio", games: 5, wins: 1, losses: 4, sets: 3, gamePoints: 10, total: 23 },
    { name: "Rafael Brandao", games: 5, wins: 1, losses: 4, sets: 3, gamePoints: 10, total: 23 },
    { name: "Fernando Garpelli", games: 5, wins: 1, losses: 4, sets: 2, gamePoints: 10, total: 22 },
    { name: "Joao Vicente", games: 5, wins: 0, losses: 5, sets: 2, gamePoints: 10, total: 12 },
    { name: "Andre Mota", games: 5, wins: 0, losses: 5, sets: 0, gamePoints: 10, total: 10 },
    { name: "Tadeu Maia", games: 5, wins: 0, losses: 5, sets: 0, gamePoints: 4, total: 4 },
];

export const OCTOBER_RANKING = [
    { name: "Robson Fiusa", games: 8, wins: 7, losses: 1, sets: 15, gamePoints: 16, total: 101 },
    { name: "Lincoln", games: 8, wins: 7, losses: 1, sets: 14, gamePoints: 16, total: 100 },
    { name: "Claudio", games: 8, wins: 6, losses: 2, sets: 14, gamePoints: 16, total: 90 },
    { name: "Thiago Mello", games: 8, wins: 6, losses: 2, sets: 14, gamePoints: 16, total: 90 },
    { name: "Guilherme Tadini", games: 8, wins: 6, losses: 2, sets: 12, gamePoints: 16, total: 88 },
    { name: "Daniel Tomaz", games: 8, wins: 6, losses: 2, sets: 12, gamePoints: 16, total: 88 },
    { name: "Leo Alves", games: 8, wins: 6, losses: 2, sets: 12, gamePoints: 16, total: 88 },
    { name: "Caio Dias", games: 8, wins: 6, losses: 2, sets: 12, gamePoints: 14, total: 86 },
    { name: "Evaldo", games: 8, wins: 5, losses: 3, sets: 13, gamePoints: 16, total: 79 },
    { name: "José Eduardo", games: 8, wins: 5, losses: 3, sets: 12, gamePoints: 16, total: 78 },
    { name: "Ary", games: 8, wins: 5, losses: 3, sets: 11, gamePoints: 16, total: 77 },
    { name: "Diego Rodrigues", games: 8, wins: 5, losses: 3, sets: 11, gamePoints: 16, total: 77 },
    { name: "Marcelo Candido", games: 8, wins: 5, losses: 3, sets: 11, gamePoints: 16, total: 77 },
    { name: "Gustavo Granja", games: 8, wins: 5, losses: 3, sets: 10, gamePoints: 16, total: 76 },
    { name: "Cleiton", games: 8, wins: 5, losses: 3, sets: 10, gamePoints: 16, total: 76 },
    { name: "Iramaia", games: 8, wins: 4, losses: 4, sets: 11, gamePoints: 16, total: 67 },
    { name: "Gabriel Abrame", games: 8, wins: 4, losses: 4, sets: 10, gamePoints: 16, total: 66 },
    { name: "Tiago Meira", games: 8, wins: 4, losses: 4, sets: 10, gamePoints: 16, total: 66 },
    { name: "Renan Martin", games: 8, wins: 4, losses: 4, sets: 10, gamePoints: 16, total: 66 },
    { name: "Arthur", games: 8, wins: 4, losses: 4, sets: 10, gamePoints: 16, total: 66 },
    { name: "Mario", games: 8, wins: 4, losses: 4, sets: 9, gamePoints: 16, total: 65 },
    { name: "Fernando Soares", games: 8, wins: 4, losses: 4, sets: 9, gamePoints: 16, total: 65 },
    { name: "Joao Claudio", games: 8, wins: 4, losses: 4, sets: 9, gamePoints: 16, total: 65 },
    { name: "Marcos Rodrigues", games: 8, wins: 4, losses: 4, sets: 8, gamePoints: 16, total: 64 },
    { name: "Lucas Lima", games: 8, wins: 4, losses: 4, sets: 8, gamePoints: 14, total: 62 },
    { name: "Pedro", games: 8, wins: 4, losses: 4, sets: 8, gamePoints: 10, total: 58 },
    { name: "João Orsi", games: 8, wins: 3, losses: 5, sets: 10, gamePoints: 16, total: 56 },
    { name: "Flavio", games: 8, wins: 3, losses: 5, sets: 8, gamePoints: 16, total: 54 },
    { name: "Fernando Garpelli", games: 8, wins: 3, losses: 5, sets: 6, gamePoints: 16, total: 52 },
    { name: "Fernando Martin", games: 8, wins: 3, losses: 5, sets: 7, gamePoints: 14, total: 51 },
    { name: "Gilson Santana", games: 8, wins: 3, losses: 5, sets: 6, gamePoints: 14, total: 50 },
    { name: "Paulo Soares", games: 8, wins: 3, losses: 5, sets: 7, gamePoints: 10, total: 47 },
    { name: "Joao Vicente", games: 8, wins: 2, losses: 6, sets: 7, gamePoints: 16, total: 43 },
    { name: "Rafael Brandao", games: 8, wins: 2, losses: 6, sets: 5, gamePoints: 16, total: 41 },
    { name: "Andre Mota", games: 8, wins: 2, losses: 6, sets: 5, gamePoints: 16, total: 41 },
    { name: "Luan", games: 8, wins: 2, losses: 6, sets: 4, gamePoints: 16, total: 40 },
    { name: "Luiz Fernando", games: 8, wins: 2, losses: 6, sets: 5, gamePoints: 10, total: 35 },
    { name: "Marcelo Bassi", games: 8, wins: 1, losses: 7, sets: 4, gamePoints: 4, total: 27 },
    { name: "Arildo", games: 8, wins: 1, losses: 7, sets: 3, gamePoints: 14, total: 27 },
    { name: "Tadeu Maia", games: 8, wins: 0, losses: 8, sets: 0, gamePoints: 4, total: 4 },
];

export const parseScore = (score: string, player1Id: number, player2Id: number): { [playerId: number]: number } => {
  if (!score || score.trim() === '') {
    return { [player1Id]: 0, [player2Id]: 0 };
  }

  const sets = score.trim().split(/\s+/);
  let p1SetsWon = 0;
  let p2SetsWon = 0;

  for (const set of sets) {
    const games = set.split('-').map(g => parseInt(g, 10));
    if (games.length === 2 && !isNaN(games[0]) && !isNaN(games[1])) {
      if (games[0] > games[1]) {
        p1SetsWon++;
      } else if (games[1] > games[0]) {
        p2SetsWon++;
      }
    }
  }

  return {
    [player1Id]: p1SetsWon,
    [player2Id]: p2SetsWon,
  };
};

export const generateMasterBracket = (contenders: Player[]): BracketMatch[] => {
  if (contenders.length < 16) return [];

  const bracket: BracketMatch[] = [];
  
  const seeds = [0, 15, 7, 8, 4, 11, 3, 12, 5, 10, 2, 13, 6, 9, 1, 14];
  
  for (let i = 0; i < 8; i++) {
    bracket.push({
      id: `R16-${i}`,
      round: 'R16',
      matchIndex: i,
      player1Id: contenders[seeds[i * 2]].id,
      player2Id: contenders[seeds[i * 2 + 1]].id,
      winnerId: null,
      score: '',
    });
  }

  for (let i = 0; i < 4; i++) {
    bracket.push({
      id: `QF-${i}`,
      round: 'QF',
      matchIndex: i,
      player1Id: null,
      player2Id: null,
      winnerId: null,
      score: '',
      sourceMatch1Id: `R16-${i * 2}`,
      sourceMatch2Id: `R16-${i * 2 + 1}`,
    });
  }

  for (let i = 0; i < 2; i++) {
    bracket.push({
      id: `SF-${i}`,
      round: 'SF',
      matchIndex: i,
      player1Id: null,
      player2Id: null,
      winnerId: null,
      score: '',
      sourceMatch1Id: `QF-${i * 2}`,
      sourceMatch2Id: `QF-${i * 2 + 1}`,
    });
  }

  bracket.push({
    id: 'F-0',
    round: 'F',
    matchIndex: 0,
    player1Id: null,
    player2Id: null,
    winnerId: null,
    score: '',
    sourceMatch1Id: 'SF-0',
    sourceMatch2Id: 'SF-1',
  });
  
  return bracket;
};
