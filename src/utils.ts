export const raise = (message: string) => {
  throw new Error(message);
};

export const nowOrThen = (p: any, block: any) => {
  if (p && p.then) {
    return p.then(block);
  } else {
    return block(p);
  }
};
