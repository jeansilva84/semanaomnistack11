const connection = require('../database/connection');

module.exports = {

  async index(request, response) {
    const { page = 1 } = request.query; // Paginação

    const incidents = await connection('incidents')
      .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
      .limit(5) // Paginação, busca 5 registro por vez
      .offset((page - 1) * 5) // Paginação, busca 5 registro por vez
      .select([
        'incidents.*',
        'ongs.name',
        'ongs.email',
        'ongs.whatsapp',
        'ongs.city',
        'ongs.uf'
      ]);

    const [count] = await connection('incidents').count();

    response.header('X-Total-Count', count['count(*)']);

    return response.json(incidents)
  },

  async create(request, response) {
    const { title, description, value } = request.body;
    const ong_id = request.headers.authorization;

    const [id] = await connection('incidents').insert({
      title,
      description,
      value,
      ong_id
    });

    return response.json({ id });
  },

  async delete(request, response) {
    const { id } = request.params;
    const ong_id = request.headers.authorization;

    const incident = await connection('incidents')
      .where('id', id)
      .select('ong_id')
      .first();
    
    if (ong_id != incident.ong_id){
      return response.status(401).json({ error: 'Operation not permitted.' }); // Não autorizado
    }


    await connection('incidents').where('id', id).delete();

    return response.status(204).send(); // Deu certo, mas sem retorno

  }

};