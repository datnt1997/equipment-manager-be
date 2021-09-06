const EquipmentsDAO = require('../dao/equipmentsDAO');
const ResponseModel = require('../model/response.model');
const EquipmentModel = require('../model/equipment.model');
const getIsAuthorized = require('../utils/authorization');
const EQUIPMENT_STATUS = require('../constant');
const UserModel = require('../model/user.model');
const UsersDAO = require('../dao/usersDAO');

class EquipmentsController {
  static async getAllEquipments(req, res){
    try{
      let isAuthorized = await getIsAuthorized(req, true);
      if (!isAuthorized) {
        let response = new ResponseModel({
          errors: ['Can not authorization'],
          status: 401,
          successful: false
        });
        res.status(401).json(response.toJson());
        return;
      }
      let equipments = await EquipmentsDAO.getEquipments();
      let response = new ResponseModel({
        response: { equipments }
      });
      res.status(200).json(response.toJson());
      return;
    }catch(e){
      let response = new ResponseModel({
        errors: [e],
        status: 500,
        successful: false
      });
      res.status(500).json(response.toJson())
      return;
    }
  }

  static async getEquipmentByID(req, res) {
    try {
      if (req?.params?.id) {
        let equipment = await EquipmentsDAO.getEquipmentByID(req.params.id);
        if (!equipment) {
          let response = new ResponseModel({
            errors: ['Not found equipment'],
            status: 404,
            successful: false
          });
          res.status(404).json(response.toJson());
          return;
        }
        let response = new ResponseModel({
          response: { equipment }
        });
        res.status(200).json(response.toJson());
        return;
      }
      let response = new ResponseModel({
        errors: ['Equipment ID is not valid'],
        status: 400,
        successful: false
      });
      res.status(500).json(response.toJson());
      return;
    } catch (e) {
      let response = new ResponseModel({
        errors: [e],
        status: 500,
        successful: false
      });
      res.status(500).json(response.toJson());
    }
  }

  static async createEquipment(req, res) {
    try {
      let isAuthorized = await getIsAuthorized(req, true);
      if (!isAuthorized) {
        let response = new ResponseModel({
          errors: ['Can not authorization'],
          status: 401,
          successful: false
        });
        res.status(401).json(response.toJson());
        return;
      }
      let equipmentFromBody = req.body
      let errors = [];
      if (!equipmentFromBody.name) {
        errors.push({ name: 'This field is required!' });
      }
      if (errors.length) {
        let response = new ResponseModel({
          errors,
          status: 400,
          successful: false
        });
        res.status(400).json(response.toJson())
        return;
      }

      let equipment = new EquipmentModel({ ...equipmentFromBody });
      let insertResult = await EquipmentsDAO.addEquipment(equipment);
      if (!insertResult.success) {
        errors.push(insertResult.error);
      }
      if (errors.length) {
        let response = new ResponseModel({
          errors,
          status: 400,
          successful: false
        });
        res.status(400).json(response.toJson())
        return;
      }

      let response = new ResponseModel({});
      res.status(200).json(response.toJson());
      return;
    } catch (e) {
      let response = new ResponseModel({
        errors: [e],
        status: 500,
        successful: false
      });
      res.status(500).json(response.toJson())
      return;
    }
  }

  static async bookAEquipment(req, res) {
    try {
      let isAuthorized = await getIsAuthorized(req);
      if (!isAuthorized) {
        let response = new ResponseModel({
          errors: ['Can not authorization'],
          status: 401,
          successful: false
        });
        res.status(401).json(response.toJson());
        return;
      }
      let userJwt = req.get("Authorization").slice("Bearer ".length)
      let user = await UserModel.decoded(userJwt);
      if (req.body?.equipmentID) {
        let { equipmentID } = req.body;
        let equipment = await EquipmentsDAO.getEquipmentByID(equipmentID);
        let userFromDB = await UsersDAO.getUser(user.email);
        if (equipment?.status === EQUIPMENT_STATUS.AVAILABLE) {
          let equipmentInfo = {
            userID: userFromDB._id,
            status: EQUIPMENT_STATUS.WAITING_FOR_APPROVAL
          }
          let updateResult = await EquipmentsDAO.updateEquipment(equipmentID, equipmentInfo);
          if (!updateResult.success) {
            let response = new ResponseModel({
              errors: [updateResult.error],
              status: 400,
              successful: false
            });
            res.status(400).json(response.toJson())
            return;
          }
          let response = new ResponseModel();
          res.status(200).json(response.toJson())
          return;
        }
        let response = new ResponseModel({
          errors: ['Cannot book this equipment'],
          status: 400,
          successful: false
        });
        res.status(400).json(response.toJson())
        return;
      }
      if (!req.body?.equipmentID) {
        let response = new ResponseModel({
          errors: ['Equipment ID is not valid!'],
          status: 400,
          successful: false
        });
        res.status(400).json(response.toJson())
        return;
      }
    } catch (e) {
      let response = new ResponseModel({
        errors: [e],
        status: 500,
        successful: false
      });
      res.status(500).json(response.toJson())
      return;
    }
  }

  static async returnAEquipment(req, res) {
    try {
      let isAuthorized = await getIsAuthorized(req);
      if (!isAuthorized) {
        let response = new ResponseModel({
          errors: ['Can not authorization'],
          status: 401,
          successful: false
        });
        res.status(401).json(response.toJson());
        return;
      }
      if (req.body?.equipmentID) {
        let { equipmentID } = req.body;
        let equipment = await EquipmentsDAO.getEquipmentByID(equipmentID);
        if ([EQUIPMENT_STATUS.NOT_AVAILABLE, EQUIPMENT_STATUS.WAITING_FOR_APPROVAL].includes(equipment?.status)) {
          let equipmentInfo = {
            userID: null,
            status: EQUIPMENT_STATUS.AVAILABLE
          }
          let updateResult = await EquipmentsDAO.updateEquipment(equipmentID, equipmentInfo);
          if (!updateResult.success) {
            let response = new ResponseModel({
              errors: [updateResult.error],
              status: 400,
              successful: false
            });
            res.status(400).json(response.toJson())
            return;
          }
          let response = new ResponseModel();
          res.status(200).json(response.toJson())
          return;
        }
        let response = new ResponseModel({
          errors: ['Cannot return this equipment'],
          status: 400,
          successful: false
        });
        res.status(400).json(response.toJson())
        return;
      }
      if (!req.body?.equipmentID) {
        let response = new ResponseModel({
          errors: ['Equipment ID is not valid!'],
          status: 400,
          successful: false
        });
        res.status(400).json(response.toJson())
        return;
      }
    } catch (e) {
      let response = new ResponseModel({
        errors: [e],
        status: 500,
        successful: false
      });
      res.status(500).json(response.toJson())
    }
  }
}

module.exports = EquipmentsController;