//PessoaController esta em maisculo, porque pessoa vai ser uma classe
//const database = require('../models') //por padrão, JS procura uma pasta index.js dentro de models
//const Sequelize = require('sequelize');

const { PessoasServices } = require('../services/index.js');
const pessoasServices = new PessoasServices(); //Pessoas é o nome do modelo

class PessoaController {
    static async pegaPessoasAtivas(req,res){ //devido ao esc`op`o padrao vai trazer apenas os ativos por padrao
        try{
            const pessoasAtivas = await pessoasServices.pegaTodosOsRegistros();
            return res.status(200).json(pessoasAtivas)
        }catch(error){
            return res.status(500).json(error.message)
        }
    }

    
    static async pegaTodasAsPessoas(req,res){
        try{
            const todasAsPessoas = await database.Pessoas.scope('todos').findAll(); // scope criado no model pessoas
            return res.status(200).json(todasAsPessoas)
        }catch(error){
            return res.status(500).json(error.message)
        }
    }

    static async pegaUmaPessoa(req,res) {
        const { id } = req.params
        try{
            const umaPessoa = await database.Pessoas.findOne({
                where : {
                    id: Number(id)}
            })
            return res.status(200).json(umaPessoa)
        }catch(error){
            return res.status(500).json(error.message)
        }
    }

    static async criaPessoa(req,res) {
        const novaPessoa = req.body;
        try{
            const novaPessoaCriada = await database.Pessoas.create(novaPessoa);
            return res.status(200).json(novaPessoaCriada);
        }catch(error){
            return res.status(500).json(error.message);
        }
    }

    static async atualizaPessoa(req,res) {
        const novasInfos = req.body;
        const {id} = req.params;
        try{
            await database.Pessoas.update(novasInfos,{where: {id: Number(id)}});
            const pessoaAtualizada = await database.Pessoas.findOne({
                where : {
                    id: Number(id)}
            })
            return res.status(200).json(pessoaAtualizada);
        }catch(error){
            return res.status(500).json(error.message);
        }
    }

    static async apagaPessoa(req,res) {
        const {id} = req.params;
        try{
            await database.Pessoas.destroy({where: {id: Number(id)}});
            return res.status(200).json({mensagem: `id ${id} deletado com sucesso`})
        }catch{
            return res.status(500).json(error.message);

        }
    }

    static async restauraPessoa(req,res){
        const {id} = req.params;

        try{
            await database.Pessoas.restore({where : {id : Number(id)}});
            return res.status(200).json({mensagem: `id ${id} restaurado !`});
        }catch(error){
            return res.status(500).json(error.message);

        }
    }

    static async restauraMatricula(req, res) {
        const { estudanteId, matriculaId } = req.params
        try {
          await database.Matriculas.restore({
            where: {
              id: Number(matriculaId),
              estudante_id: Number(estudanteId)
            }
          })
          return res.status(200).json({ mensagem: `id ${id} restaurado`})
        } catch (error) {
          return res.status(500).json(error.message)
        }
      }
     

    static async pegaUmaMatricula(req,res) {
        const { estudanteId, matriculaId } = req.params
        try{
            console.log("INICIOU PESQUISA");
            const umaMatricula = await database.Matriculas.findOne({
                where : {
                    id: Number(matriculaId),
                    estudante_id : Number(estudanteId),
                }
            })
            return res.status(200).json(umaMatricula)
        }catch(error){
            return res.status(500).json(error.message)
        }
    }

    /*
    static async criaMatricula(req,res) {
        const {estudanteId} = req.params;
        //console.log("estudante id = " + estudanteId);
        const novaMatricula = { ...req.body, estudante_Id: estudanteId}
        console.log("Nova matricula = " + novaMatricula);
        
        console.log("Nova matricula estudante_id = " + novaMatricula.estudante_id);
        //console.log("Nova matricula estudante_id = " + novaMatricula.estudante_id);

        try{
            const novaMatriculaCriada = await database.Matriculas.create({novaMatricula});

            return res.status(200).json(novaMatriculaCriada);
        }catch(error){
            return res.status(500).json(error.message);
        }
    }
    */
    static async criaMatricula(req, res) {
        const { estudanteId } = req.params
        console.log("EstudanteId = " + estudanteId);
        //const novaMatricula = { ...req.body, estudante_Id: Number(estudanteId) }
        try {
          const novaMatriculaCriada = await database.Matriculas.create({
            estudante_Id: Number(estudanteId),
            status: req.body.status,
            turma_id: req.body.turma_id

          })
            return res.status(200).json(novaMatriculaCriada)
        } catch (error) {
          return res.status(500).json(error.message)
        }
      }
    
      
    static async atualizaMatricula(req,res) {
        const { estudanteId , matriculaId } = req.params;
        const novasInfos = req.body;
        try{
            await database.Matriculas.update(novasInfos,{
                where: {
                    id: matriculaId,
                    estudante_Id: estudanteId
                }});
            const MatriculaAtualizada = await database.Matriculas.findOne({
                where : {
                    id: Number(matriculaId)}
            })
            return res.status(200).json(MatriculaAtualizada);
        }catch(error){
            return res.status(500).json(error.message);
        }
    }

    static async apagaMatricula(req,res) {
        const { estudanteId , matriculaId } = req.params;

        try{
            await database.Matriculas.destroy({where: {id: Number(matriculaId)}});
            return res.status(200).json({mensagem: `id ${matriculaId} deletado com sucesso`})
        }catch(error){
            return res.status(500).json(error.message);

        }
    }

    static async pegaMatriculas(req,res) {
        const { estudanteId } = req.params;
      
        try{
            const pessoa = await database.Pessoas.findOne({where: {id: Number(estudanteId)}});
            const matriculas = await pessoa.getAulasMatriculadas(); //get criado a partir de 'scope' e 'as' definidos na associacao do modelo Pessoas com matriculas
            return res.status(200).json(matriculas);
        }catch(error){
            return res.status(500).json(error.message);
        
        }
    }

    static async pegaMatriculasPorTurma(req,res) {
        const { turmaId } = req.params;
        
        try{
            const todasAsMatriculas = await database.Matriculas.findAndCountAll({
                where:{
                    turma_id: Number(turmaId),
                    status: 'confirmado'        
                },
            limit:20,
            order:[
                ['estudante_id','ASC']
            ]
            })        
            return res.status(200).json(todasAsMatriculas); //todasAsMatriculas.count
        }catch(error){
            return res.status(500).json(error.message);
        
        }
    }

    static async pegaTurmasLotadas(req,res) {
        const lotacaoTurma =2;
        
        try{
            const turmasLotadas = await database.Matriculas.findAndCountAll({
                where: {
                    status: 'confirmado'
                },
                attibutes: ['turma_id'], 
                group:['turma_id'],
                having: Sequelize.literal(`count(turma_id) >= ${lotacaoTurma}`)
                });
            return res.status(200).json(turmasLotadas.count);
        }catch(error){
            return res.status(500).json(error.message);
        
        }
    }

    static async cancelaPessoa(req,res) { //TRANSACTIONS
        const { estudanteId } = req.params;        
        try{
            database.sequelize.transaction(async transacao => {
                await database.Pessoas.update({ativo:false}, {where: {id:Number(estudanteId)}},{transaction: transacao});

                await database.Matriculas.update({status: 'cancelado'}, {where: {estudante_id: Number(estudanteId)}});


            return res.status(200).json({message: `Matriculas referentes estudante ${estudanteId} canceladas`});

            })
                    }catch(error){
            return res.status(500).json(error.message);
        
        }
    }
}

module.exports = PessoaController;