module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'cities',
      [
        {
          city: 'Gaeco',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          city: 'PGJ',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          city: 'Anexo I',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          city: 'PMJ Natal',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          city: 'Tororos',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
