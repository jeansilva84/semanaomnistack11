const connection = require('../database/connection');

module.exports = {
  async create(request, response) {
    const { id } = request.body;

    const ong_name = await connection('ongs')
      .where('id', id)
      .select('name')
      .first(); //first para não retornar um array
    
    if (!ong_name) {
      return response.status(400).json({ erro: 'No ONG found with this ID' });
    }

    return response.json(ong_name);
  }
}