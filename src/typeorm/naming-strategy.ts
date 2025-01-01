import { DefaultNamingStrategy, NamingStrategyInterface, Table } from 'typeorm';

export class AppNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private formatTableName(tableOrName: Table | string): string {
    const capitalized = this.capitalizeFirstLetter(this.getTableName(tableOrName));

    // pluralize
    if (capitalized.endsWith('s')) {
      return capitalized;
    } else if (/x$|z$|ch$|sh$/i.test(capitalized)) {
      return `${capitalized}es`;
    } else {
      return `${capitalized}s`;
    }
  }

  // protected getTableName(tableOrName: Table | string): string {
  //   if (typeof tableOrName === 'string') {
  //     return tableOrName.includes('.') ? tableOrName.split('.')[1] : tableOrName;
  //   }
  //   return tableOrName.name;
  // }

  // tableName(targetName: string, userSpecifiedName: string | undefined): string {
  //   return userSpecifiedName || this.capitalizeFirstLetter(targetName);
  // }

  uniqueConstraintName(tableOrName: Table | string, columnNames: string[]): string {
    return `UQ_${this.formatTableName(tableOrName)}_${columnNames
      .map((n) => this.capitalizeFirstLetter(n))
      .join('_')}`;
  }

  primaryKeyName(tableOrName: Table | string, columnNames: string[]): string {
    return `PK_${this.formatTableName(tableOrName)}_${columnNames
      .map((n) => this.capitalizeFirstLetter(n))
      .join('_')}`;
  }

  indexName(tableOrName: Table | string, columnNames: string[], _where?: string): string {
    return `IX_${this.formatTableName(tableOrName)}_${columnNames
      .map((n) => this.capitalizeFirstLetter(n))
      .join('_')}`;
  }

  foreignKeyName(
    tableOrName: Table | string,
    _columnNames: string[],
    referencedTablePath?: string,
    _referencedColumnNames?: string[],
  ): string {
    const targetTable = this.formatTableName(tableOrName);
    const sourceTable = referencedTablePath ? this.formatTableName(referencedTablePath) : '';
    return `FK_${targetTable}_${sourceTable}`;
  }
}
