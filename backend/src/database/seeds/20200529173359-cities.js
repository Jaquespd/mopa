module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'cities',
      [
        {
          city: 'Mossoró',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          city: 'Monte Alegre',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          city: 'Goianinha',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          city: 'Touros',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          city: 'Macaíba',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
