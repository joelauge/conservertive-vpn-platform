import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddVpnCredentialsToUser1700000000000 implements MigrationInterface {
  name = 'AddVpnCredentialsToUser1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'vpnUsername',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'vpnPassword',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'vpnServerId',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'vpnConfigGeneratedAt',
        type: 'timestamp',
        isNullable: true,
      }),
      new TableColumn({
        name: 'vpnConfigExpiresAt',
        type: 'timestamp',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('users', [
      'vpnUsername',
      'vpnPassword',
      'vpnServerId',
      'vpnConfigGeneratedAt',
      'vpnConfigExpiresAt',
    ]);
  }
}
