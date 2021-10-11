import axios from "axios"
import qs from "qs"
/*
Global rate limit of 5 requests a second per IP address in affect for most requests.
Optimal to use larger batch requests than smaller individual ones.
*/

const base_url = 'https://api.mangadex.org'
const limit = 30;
const ch_limit = 25;
/**
 * @returns {Promise} GET response as a Promise
 */
    const getRandomManga = () =>{
        console.log("executing GET request for random manga...")
        return axios({
            method: 'get',
            url: base_url + '/manga/random',
            params: {includes:["author", "artist", "cover_art", "tags"]},
            responseType: 'json'
        })
    }

    /**
     * 
     * @param {Object} queryParams 
     * @returns {Promise} GET response as a Promise
     */
    const queryManga = (queryParams, orderType ="") => {
        console.log("executing GET request for queried manga...")
        let order = {relevance: "desc"}
        if (orderType === "") {
            if(!queryParams || queryParams.title === ""){
                order = {followedCount: "desc"}
            }
        }
        else {
            order = {[orderType]: "desc"}
        }
        
        return axios({
            method: 'get',
            url: base_url + '/manga',
            responseType: 'json',
            params: {
                limit: limit,
                includes:["author", "artist", "cover_art", "tags"],
                
                order: order,
                ...queryParams
            },
            paramsSerializer: params => {
                return qs.stringify(params)
              }
        })
    }

    /**
     * 
     * @param {Array} coverIds - Array of cover ids
     * @returns {Promise} GET response as a Promise containing cover art files
     */
    const getCoverArtList = (coverIds) => {
        console.log("executing GET request for cover art...")
        return axios({
            method: 'get',
            url: base_url + '/cover',
            responseType: 'json',
            params: {
                limit: limit,
                ids: coverIds
            }
        })
    }

    const getCoverArt = (coverId) => {
        console.log("executing GET request for cover art")
        return axios({
            method: 'get',
            url: base_url + '/cover/' + coverId,
            responseType: 'json'
        })
    }


    /* Retrieving pages from the MangaDex@home Network
    *  Four fields required to retrieve chapter image
    *  .data.id                    -  API Chapter ID
    *  .data.attributes.hash       -  MangaDex@home Chapter Hash
    *  .data.attributes.data       -  data quality mode filenames
    *  .data.attributes.dataSaver  -  data-saver quality mode filenames
    * 
    *  If the server you have been assigned fails to serve images, you are allowed to call the 
    *  /at-home/server/{ chapter id } endpoint again to get another server.
    */
    

    /**
     * 
     * @param {Array} queryParams 
     * @returns {Promise} GET response as a Promise 
     * 
     */

    //  {
    //    ...,
    //    "data": {
    //      "id": "e46e5118-80ce-4382-a506-f61a24865166",
    //      ...,
    //      "attributes": {
    //        ...,
    //        "hash": "e199c7d73af7a58e8a4d0263f03db660",
    //        "data": [
    //          "x1-b765e86d5ecbc932cf3f517a8604f6ac6d8a7f379b0277a117dc7c09c53d041e.png",
    //          ...
    //        ],
    //        "dataSaver": [
    //          "x1-ab2b7c8f30c843aa3a53c29bc8c0e204fba4ab3e75985d761921eb6a52ff6159.jpg",
    //          ...
    //        ]
    //      }
    //    }
    //  }

    //limit:100 def
    const getChapterList = (queryParams) => {
        console.log("executing GET request for chapter lists...")

        return axios({
            method: 'get',
            url: base_url + '/chapter',
            responseType:'json',
            params: {
                limit: 100,
                translatedLanguage: ['en'],
                order: {
                    chapter: 'asc'
                   },
                contentRating:["safe", "suggestive", "erotica" , "pornographic"],
                ...queryParams
            },
            paramsSerializer: params => {
                return qs.stringify(params)
              }
        })
    }
    //order['chapter'] = asc
    
    /**
     * @param {string} chapterID
     * @returns {Promise} GET response as a Promise 
     * 
     */
    
    // {
    //     "baseUrl" : "string"
    // }

    const getBaseUrl = (chapterID) => {
        return axios({
            method: 'get',
            url: base_url + `/at-home/server/${chapterID}`,
            responseType: 'json'
        })
    }

    const getTags = () => {
        return axios({
            method: 'get',
            url: base_url + `/manga/tag`,
            responseType: 'json'
        })
    };


    /**
     * qualityMode = {'data', 'dataSaver'}
     * @returns {string} Image Url for corresponding Chapter
     */
    
    const getChapterImgUrl = (baseUrl, qualityMode, chapterHash, fileName) => {
        return `${baseUrl}/${qualityMode}/${chapterHash}/${fileName}`
    }



    const api = {
        getRandomManga,
        queryManga,
        getCoverArtList,
        getChapterList,
        getCoverArt,
        getBaseUrl,
        getChapterImgUrl,
        getTags,
        limit,
        ch_limit
    };

    export default api;
    