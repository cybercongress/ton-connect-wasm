export const trimString = (address, firstArg, secondArg) => {
  const first = firstArg || 11;
  const second = secondArg || 4;

  if (address && address.length > 11) {
    return `${address.substring(0, first)}...${address.substring(
      address.length - second
    )}`;
  }
  if (address && address.length < 11) {
    return address;
  }
  return "";
};
