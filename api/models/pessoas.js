'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pessoas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Pessoas.hasMany(models.Turmas, {
        foreignKey: 'docente_Id'
      })

      Pessoas.hasMany(models.Matriculas,{
        foreignKey: 'estudante_Id',
        scope:{ status: 'confirmado'},
        as: 'aulasMatriculadas'
      })

    }
  }
  Pessoas.init({
    nome: {
      type: DataTypes.STRING,
      validate: {
        funcaoValidadora: function(dado) {
          if(dado.length < 3) throw new Error('Campo nome deve ter mais de 3 caracteres')
        }
      }
    },
      ativo: DataTypes.BOOLEAN,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          args: true,
          msg: 'Dados do tipo email inválido'
        }
      }
    },
      role: DataTypes.STRING
  },
  {
    sequelize,
    paranoid: true, //cria exclusão suave
    defaultScope: {
      where: {ativo: true} //cria escopo padrao onde todas as query feitas nesse model, vao por padrao selecionar apenas registros com ativo = true
    },
    scopes: { //podemos criar quantos scopes forem necessarios
      todos: {where: {}}
    },
    modelName: 'Pessoas'
  });
  return Pessoas;
};






