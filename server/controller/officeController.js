import Helper from '../Helper/Helper';
import ModelOffice from '../db/Office';


// Create a political office
const createOffice = async (req, res) => {
  const result = Helper.isValidOffice(req.body);
  if (result.error) {
    return Helper.invalidDataMessage(res, result);
  }

  const AddOfficeQuery = new ModelOffice(req.body);
  if (!await AddOfficeQuery.createNewOffice()) return res.status(400).send({ status: 400, Error: 'Unable to create newOffice' });

  return res.status(201).send({ status: 201, data: AddOfficeQuery.result });

  // const newOffice = {
  //   id: offices.length + 1,
  //   type: req.body.type,
  //   name: req.body.name,
  // };
  // offices.push(newOffice);
  // return res.status(201).send({ status: 200, data: [newOffice] });
};


// Fetch all political offices records

const getAll = async (req, res) => {
  const GetAllOffice = new ModelOffice();
  if (!await GetAllOffice.getOffices()) return res.status(400).send({ status: 400, Error: 'Unable to retrieve all Offices!' });
  return res.send({ status: 200, data: GetAllOffice.result });
};

const getById = async (req, res) => {
  const { id } = req.params;
  const RetrieveOneOfficeQuery = new ModelOffice(id);
  if (!await RetrieveOneOfficeQuery.getOfficeById()) return res.status(400).send({ status: 400, Error: 'Unable to get Office' });

  return res.status(200).send({ status: 200, data: RetrieveOneOfficeQuery.result });
  /* const office = offices.find(off => off.id === parseInt(req.params.id, 10));
  if (!office) return res.status(404).
  send({ status: 404, Error: 'The Office  with given ID was not found' });
   return res.send({ status: 200, data: office }); */
};

export { createOffice, getAll, getById };
