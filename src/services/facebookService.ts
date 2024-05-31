import mySqlPool from "../config/mysql";
import * as path from "path";
import { FacebookHelper } from "../helpers/facebookHelper";

class FacebookService {
  postToFB = async (req, res) => {
    try {
      const data = await mySqlPool.query(
        "select * , (select image from images where animal_id = ? limit 1) as image from animals where id = ?",
        [req.params.animal_id, req.params.animal_id]
      );
      if (!data || (data[0] as any).length == 0) {
        throw new Error("FB: Record not found");
      }
      const record = (data[0] as any)[0];
     

      if (record) {
        let breed = undefined;
        if (record?.breed_id) {
          const breeds = await mySqlPool.query(
            "select * from breed where id = ?",
            [record?.breed_id]
          );
          if (breeds || (breeds[0] as any).length > 0) {
            breed = (breeds[0] as any)[0]?.name;
          }
        }

        let content = "".concat(record?.name ?? "").concat("\n\n");
        // if (breed && breed != "") {
        //   content = content
        //     .concat("Breed: ")
        //     .concat(breed ?? "")
        //     .concat("\n");
        // }
        // content = content
        //   .concat("Color: ")
        //   .concat(record?.color ?? "")
        //   .concat("\n");
        // content = content
        //   .concat("Age: ")
        //   .concat(record?.age ?? "")
        //   .concat("\n");
        content = content
          .concat(record?.short_description ?? "")
          .concat("\n\n");
        content = content.concat(
          "Welcome to visit our website to know more. Get an Adoption now!"
        );

        if (record?.image && record?.image != "") {
          const imagePath = path.join(
            __dirname,
            "../public/uploads/",
            record?.image
          );
          
        const fbResponse =  await FacebookHelper.postPhotos(imagePath, `${content}\n`);
        console.log(fbResponse);
        }
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };


  postToFBAnimalId = async (animal_id) => {
     try {
      const data = await mySqlPool.query(
        "select * , (select image from images where animal_id = ? limit 1) as image from animals where id = ?",
        [animal_id, animal_id],
      );
     
      if (!data || (data[0] as any).length == 0) {
        throw new Error("FB: Record not found");
      }
      const record = (data[0] as any)[0];

      console.log(record);
     

      if (record) {
        let breed = undefined;
        if (record?.breed_id) {
          const breeds = await mySqlPool.query(
            "select * from breed where id = ?",
            [record?.breed_id]
          );
          if (breeds || (breeds[0] as any).length > 0) {
            breed = (breeds[0] as any)[0]?.name;
          }
        }



        let content = "".concat(record?.name ?? "").concat("\n\n");
        // if (breed && breed != "") {
        //   content = content
        //     .concat("Breed: ")
        //     .concat(breed ?? "")
        //     .concat("\n");
        // }
        // content = content
        //   .concat("Color: ")
        //   .concat(record?.color ?? "")
        //   .concat("\n");
        // content = content
        //   .concat("Age: ")
        //   .concat(record?.age ?? "")
        //   .concat("\n");
        content = content
          .concat(record?.short_description ?? "")
          .concat("\n\n");
        content = content.concat(
          "Welcome to visit our website to know more. Get an Adoption now!"
        );

        if (record?.image && record?.image != "") {
          const imagePath = path.join(
            __dirname,
            "../public/uploads/",
            record?.image
          );
           
        const fbResponse =  await FacebookHelper.postPhotos(imagePath, `${content}\n`);
        console.log(fbResponse);
        }
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export default new FacebookService();
