const uuid = require('uuid')
const path = require('path');
const { User, Scheta, Provodki } = require('../models/models')
const ApiError = require('../error/ApiError');
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize');
const generateJwt = (id, email, login,phone,name) => {
  return jwt.sign(
      {id, email, login,phone,name},
      process.env.SECRET_KEY,
      {expiresIn: "24h"}
  )
}



class deviceController {



  async getProvodkiByRashod(req, res) {
    const {id} = req.params
    const user = await Provodki.findAll(
        {
            where: {'Расходный счет':id}
        },
    )
    return res.json(user)
}
async getProvodkiByPrihod(req, res) {
  const {id} = req.params
  const user = await Provodki.findAll(
      {
          where: {'Приходный счет':id}
      },
  )
  return res.json(user)
}









  async getUser(req, res) {
    const {login} = req.params
    const user = await User.findOne(
        {
            where: {Логин:login}
        },
    )
    return res.json(user.Код)
}

async getSchet(req, res) {
  const {id} = req.params
  const schet = await Scheta.findOne(
      {
          where: {Код:id}
      },
  )
  return res.json(schet)
} 


async getSchetByKodGlav(req, res) {
  const {id} = req.params
  const schet = await Scheta.findAll(
      {
          where: {Владелец:id}
      },
  )
  return res.json(schet)
} 


// async getSchetByKodChildr(req, res) {

//   const {identificator} = req.body
//   const schet = await Scheta.findAll(
//       {
//           where: {'Доступ на чтение':identificator},
//           // include: [{
//           //   require:true 
//           // }]
//       },
//   )
//   return res.json(schet)
// } 

async getSchetByKodChildr(req, res) {

  const {identificator} = req.body
  const schet = await Scheta.findAll(
      {
        where: {
          'Доступ на чтение': {
            [Op.or]: [
              { [Op.iLike]: `%${identificator}%` },
            ],
          },
        },
         
      },
  )
  return res.json(schet)
} 

async login(req, res, next) {
  const {login, password} = req.body
  const user = await User.findOne({where: {Логин:login}})

  if (user===null) {
    return res.json('Пользователь не найден')
  }

  let comparePassword = password==user.Пароль
  if (!comparePassword) {
      return   res.json('Указан неверный пароль')
  }

  
  const token = generateJwt(user.Код, user.email, user.Логин, user['Контактный телефон'], user['Имя'])
  return res.json({token})
}

}

module.exports = new deviceController()