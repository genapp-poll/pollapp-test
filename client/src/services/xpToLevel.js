//Take in Xp and return the corresponding level

export const xpToLevel = (xp) => {
  if (xp < 50) {
    return 1;
  } else if (xp < 50 * 1.5 ** 1) {
    return 2;
  } else if (xp < 50 * 1.5 ** 2) {
    return 3;
  } else if (xp < 50 * 1.5 ** 3) {
    return 4;
  } else if (xp < 50 * 1.5 ** 4) {
    return 5;
  } else if (xp < 50 * 1.5 ** 5) {
    return 6;
  } else if (xp < 50 * 1.5 ** 6) {
    return 7;
  } else if (xp < 50 * 1.5 ** 7) {
    return 8;
  } else if (xp < 50 * 1.5 ** 8) {
    return 9;
  } else if (xp < 50 * 1.5 ** 9) {
    return 10;
  } else if (xp < 50 * 1.5 ** 10) {
    return 11;
  } else if (xp < 50 * 1.5 ** 11) {
    return 12;
  } else if (xp < 50 * 1.5 ** 12) {
    return 13;
  } else if (xp < 50 * 1.5 ** 13) {
    return 14;
  } else if (xp < 50 * 1.5 ** 14) {
    return 15;
  } else if (xp < 50 * 1.5 ** 15) {
    return 16;
  } else if (xp < 50 * 1.5 ** 16) {
    return 17;
  } else if (xp < 50 * 1.5 ** 17) {
    return 18;
  } else if (xp < 50 * 1.5 ** 18) {
    return 19;
  } else if (xp < 50 * 1.5 ** 19) {
    return 20;
  } else if (xp < 50 * 1.5 ** 20) {
    return 21;
  } else if (xp < 50 * 1.5 ** 21) {
    return 22;
  } else if (xp < 50 * 1.5 ** 22) {
    return 23;
  } else if (xp < 50 * 1.5 ** 23) {
    return 24;
  } else if (xp < 50 * 1.5 ** 24) {
    return 25;
  } else if (xp < 50 * 1.5 ** 25) {
    return 26;
  } else {
    return "MAX";
  }
};

export default { xpToLevel };

//50,
