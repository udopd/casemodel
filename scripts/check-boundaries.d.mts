export interface CheckSourceTreeOptions {
  readonly srcRoot?: string;
  readonly filesContent?: Readonly<Record<string, string>>;
}

export function getLayerForRelativePath(relPath: string): string | null;
export function checkSourceTree(options?: CheckSourceTreeOptions): string[];
