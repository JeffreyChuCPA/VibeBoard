import { size_enum } from "@prisma/client";

export const sizeEnumMapping = (size: string): size_enum => {
  const sizeMapping: {[key: string]: size_enum} = {
    "40_keys": "keys_40",
    "60_keys": "keys_60",
    "65_keys": "keys_65",
    "75_keys": "keys_75",
    "80_keys": "keys_80",
    "87_keys": "keys_87",
    "104_keys": "keys_104",
    "108_keys": "keys_108",
    "120_keys": "keys_120",
    "40_ortho": "ortho_40",
    "50_ortho": "ortho_50",
    "100_keys": "keys_100"
  };
  return sizeMapping[size]; // returns null if no match
}

export const primaryColors = {
  'red': ['red'],
  'orange': ['orange', 'amber', 'yellow'],
  'amber': ['orange', 'amber', 'yellow'],
  'yellow': ['orange', 'amber', 'yellow'],
  'green': ['lime', 'green', 'emerald'],
  'lime': ['lime', 'green', 'emerald'],
  'emerald': ['lime', 'green', 'emerald'],
  'blue': ['teal', 'cyan', 'sky', 'blue'],
  'teal': ['teal', 'cyan', 'sky', 'blue'],
  'cyan': ['teal', 'cyan', 'sky', 'blue'],
  'sky': ['teal', 'cyan', 'sky', 'blue'],
  'purple': ['indigo', 'violet', 'purple', 'fuchsia'],
  'indigo': ['indigo', 'violet', 'purple', 'fuchsia'],
  'violet': ['indigo', 'violet', 'purple', 'fuchsia'],
  'fuchsia': ['indigo', 'violet', 'purple', 'fuchsia'],
  'pink': ['pink', 'rose'],
  'rose': ['pink', 'rose'],
}

