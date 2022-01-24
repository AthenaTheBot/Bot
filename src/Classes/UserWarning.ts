class UserWarning {
  id: string;
  warnings: string[];

  constructor(id: string, warnings?: string[]) {
    this.id = id;

    this.warnings = warnings || [];
  }
}

export default UserWarning;
