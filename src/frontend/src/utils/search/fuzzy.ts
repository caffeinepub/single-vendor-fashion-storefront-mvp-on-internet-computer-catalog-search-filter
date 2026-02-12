export function editDistance(s1: string, s2: string): number {
  const len1 = s1.length;
  const len2 = s2.length;
  
  if (len1 === 0) return len2;
  if (len2 === 0) return len1;
  
  const matrix: number[][] = [];
  
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  
  return matrix[len1][len2];
}

export function fuzzyMatch(query: string, target: string, maxDistance: number = 2): boolean {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  
  // Exact substring match
  if (t.includes(q)) return true;
  
  // Prefix match
  if (t.startsWith(q)) return true;
  
  // Edit distance for short queries
  if (q.length >= 3) {
    const words = t.split(/\s+/);
    for (const word of words) {
      if (editDistance(q, word) <= maxDistance) {
        return true;
      }
    }
  }
  
  return false;
}
