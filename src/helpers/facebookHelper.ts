var FB = require('fb');
import fs from "fs";

export const FacebookHelper = {
  postPhotos: async (filePath: string, caption: string) => {
    FB.setAccessToken(process.env.FB_PAGE_ACCESS_TOKEN);
    try {
      console.log("dir", __dirname);
    const fbApi =  await FB.api("/" + process.env.FB_PAGE_ID + "/photos", "POST", {
        source: fs.createReadStream(filePath),
        caption: caption,
      });
      console.log("Facebook post successfully!", fbApi);
    } catch (error) {
      console.log("Facebook post error: " + JSON.stringify(error));
    }
  },
};
