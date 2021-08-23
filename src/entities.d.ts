type ValueOf<T> = T[keyof T];
type Level = 1 | 2 | 3 | 4 | 5 | 6;
type NonEmptyArray<T> = [T, ...T[]];
type PuzzleField = FragmentView[][];
type Fragment = '╻' | '╹' | '┛' | '━' | '┳' | '╺' | '┏' | '┫' | '┃' | '┣' | '┓' | '┻' | '╸' | '┗' | '╋';
type FragmentViewRow = [0|1, 0|1, 0|1];
type FragmentView = [FragmentViewRow, FragmentViewRow, FragmentViewRow];