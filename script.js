function withMemo(f) {
  const memo = new Map();
  const hash = (...args) => args.join(",");
  return (...args) => {
    const hsh = hash(args);
    if (!memo.has(hsh)) {
      const result = f(...args);
      memo.set(hsh, result);
    }
    return memo.get(hsh);
  };
}

function calculateProbability({pity, rolls, chance}) {
  if ([pity, rolls, chance].some(arg => typeof arg === "undefined"))
    return null;
  console.log(pity, rolls, chance);
  // chance of NOT getting a 6*
  const helper = withMemo(function(pity, rolls) {
    // if you have no rolls, you are guaranteed
    // to not get a 6*
    if (rolls === 0) 
      return 1;
    // chance of getting a 6* to begin with
    const prob = Math.max(1, pity - 50) * 0.02;
    // either you get a 6* and not the one u want
    // and not any more from the rest
    const inter1 = prob * (1 - chance) * helper(0, rolls - 1);
    // or you don't get a 6* and not from the rest
    const inter2 = (1 - prob) * helper(pity + 1, rolls - 1);
    // P(A U B) = P(A) + P(B)
    return inter1 + inter2;
  });
  
  return 1 - helper(pity, rolls);
};