module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'cars',
      [
        {
          name: 'Carro 01',
          model: 'Fusca',
          license_plate: 'MPRN 0001',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Carro 02',
          model: 'Belina',
          license_plate: 'MPRN 0002',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Carro 03',
          model: 'Fiat 147',
          license_plate: 'MPRN 0003',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Carro 04',
          model: 'Bora',
          license_plate: 'MPRN 0004',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Carro 05',
          model: 'Opala',
          license_plate: 'MPRN 0005',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
