// const express = require("express")
// const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
// const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
// const ffmpeg = require("fluent-ffmpeg")

// ffmpeg.setFfmpegPath(ffmpegPath);

// const lame = require("@suldashi/lame")
// const fs = require("fs")
// const path = require("path")
// const cors = require("cors")

// require("dotenv").config({path : "./.env"})

// const app = express()

// app.use(express.json())
// app.use(cors())
// app.use(express.static('public'));

// app.post("/combine-sounds" , (req , res , next) => {

//     const {addedSounds} = req.body

//     let audioFiles = []

//     //////////console.log(addedSounds);

//     for(const soundPath of addedSounds){

// const parts = soundPath.split('/');
// const folderName = parts[parts.length - 1];
// const fileName = `${parts[parts.length - 2]}.mp3`;
// const fileNumber = fileName.split(".")[0]
// const fileFullName = fileNumber + ".mp3"

// const filePath = path.join('public', folderName, fileFullName);

//         audioFiles.push(filePath)
//     }

//     const outputFile = 'public/combined_sound.mp3';

//     const command = ffmpeg();

//     audioFiles.forEach((file) => {
//       command.input(file);
//     });

//     command
//     .format('mp3')
//     .audioCodec('libmp3lame')
//     .audioBitrate(128)
//     .on('end', () => {
//         res.setHeader('Content-Disposition', `attachment; filename="combined_sound.mp3"`);
//         res.download(outputFile, 'combined_sound.mp3', (err) => {
//             if (err) {
//                 res.status(500).send('Error during sending the file');
//             } else {
//                 fs.unlinkSync(outputFile);
//             }
//         });
//     })
//     .on('error', (err) => {
//         console.error('Error during audio encoding:', err);
//         res.status(500).send('Error during audio encoding');
//     });

//     // Start the FFmpeg process and save the output file
//     command.save(outputFile);

// })

// const express = require("express");
// const ffmpeg = require("fluent-ffmpeg");
// const fs = require("fs");
// const path = require("path");
// const cors = require("cors");

// require("dotenv").config({ path: "./.env" });

// const app = express();

// // middlewares
// app.use(express.json());
// app.use(cors());
// app.use(express.static('public'));

// app.post("/combine-sounds", async (req, res) => {

//     const { addedSounds , userFileName } = req.body;

//     // Check if addedSounds array is empty
//     if (!addedSounds || addedSounds.length === 0) {
//         return res.status(400).send('No sounds provided');
//     }

//     ////////console.log(addedSounds);

//     // get the file name from the addedSounds array
//     // extract filename and create a full filepath and add it to audioFiles array
//     // const audioFiles = addedSounds.map((soundPath) => {
//     //     const parts = soundPath.split('/');
//     //     const folderName = parts[parts.length - 1];
//     //     const fileName = `${parts[parts.length - 2]}.mp3`;
//     //     const fileNumber = fileName.split(".")[0];
//     //     const fileFullName = fileNumber + ".mp3";
//     //     const filePath = path.join('public', folderName, fileFullName);
//     //     return filePath;
//     // });

//     // musictoolname/filename.mp3
//     const audioFiles = addedSounds.map((soundPath) => {

//         const parts = soundPath.split('/');

//         // Extract folder name and file name from soundPath
//         const folderName = parts[0]; // First value before slash is the folder name
//         const fileName = parts[1]; // Second value after slash is the file name

//         const filePath = path.join('public', folderName, fileName);

//         return filePath;

//     });

//     ////////console.log(audioFiles);

//     // sets up the output file path and initialize an FFmpeg command
//     const outputFile = 'public/combined_sound.mp3';
//     const command = ffmpeg();

//     // Adding Input Files to FFmpeg Command
//     audioFiles.forEach((file) => {
//         command.input(file);
//     });

//     // {
//     //     startingTime: 1285.7142857142858,
//     //     endingTime: 1410.7142857142858,
//     //     duration: 125,
//     //     path: 'musicTool2/2.mp3'
//     //   },

//     // constructs a filter string for FFmpeg to concatenate the input audio files
//     const filterString = audioFiles.map((_ , index) => `[${index}:a]`).join('');

//     // execute some ffmpeg commands to output combined mp3 file
//     command
//         .complexFilter(`${filterString}concat=n=${audioFiles.length}:v=0:a=1[out]`)
//         .map('[out]')
//         .audioCodec('libmp3lame')
//         .audioBitrate(128)
//         .output(outputFile);

//     try {
//         // Execute the FFmpeg command and wait for it to finish
//         await new Promise((resolve , reject) => {
//             command.on('end', resolve).on('error', reject).run();
//         });

//         // Send the combined MP3 file as a response
//         // sets the response header to indicate a downloadable attachment and sends the combined MP3 file back to the client
//         res.setHeader('Content-Disposition', `attachment; filename="${userFileName}.mp3"`);
//         res.download(outputFile, `${userFileName}.mp3`, (err) => {
//             if (err) {
//                 res.status(500).send('Error during sending the file');
//             } else {
//                 fs.unlinkSync(outputFile); // Remove the temporary combined MP3 file
//             }
//         });

//     } catch (err) {
//         res.status(500).send('Error during audio processing');
//     }
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//     ////////console.log(`Music app server started on port ${PORT}`);
// });

// const express = require("express");
// const ffmpeg = require("fluent-ffmpeg");
// const fs = require("fs");
// const path = require("path");
// const cors = require("cors");
// const { log } = require("console");

// require("dotenv").config({ path: "./.env" });

// const app = express();

// // Middlewares
// app.use(express.json());
// app.use(cors());
// app.use(express.static('public'));

// // POST endpoint for combining sounds
// app.post("/combine-sounds", async (req, res) => {

//     const { addedSounds } = req.body;

//     // Check if addedSounds array is empty
//     if (!addedSounds || addedSounds.length === 0) {
//         return res.status(400).send('No addedSounds provided');
//     }

//     const audioFiles = [];

//     // Iterate over the addedSounds array and extract audio paths and durations
//     for (const segment of addedSounds) {

//         const { startingTime, endingTime, ...rest } = segment;
//         const duration = endingTime - startingTime;

//         // Use FFmpeg to extract the segment from the audio file
//         const inputFile = path.join('public', rest.path);
//         const outputFile = 'public/combined_sound.mp3';

//         const command = ffmpeg(inputFile)
//             .setStartTime(startingTime)
//             .setDuration(duration)
//             .audioCodec('libmp3lame')
//             .audioBitrate(128)
//             .output(outputFile);

//         ////////console.log(1);

//         await new Promise((resolve, reject) => {
//             ////////console.log(3);

//             command.on('end', resolve).on('error', reject).run();
//             ////////console.log(4);
//         });

//         ////////console.log(2);

//         audioFiles.push(path.join("public", rest.path));

//     }

//     const combinedOutputFile = 'public/combined_sound.mp3';
//     const mergeCommand = ffmpeg();

//     // Adding Input Files to FFmpeg Merge Command
//     audioFiles.forEach((file) => {
//         mergeCommand.input(file);
//     });

//     // Merge and process the addedSounds
//     ////////console.log(5);
//     mergeCommand
//         .complexFilter(`[0:a]concat=n=${audioFiles.length}:v=0:a=1[out]`)
//         .map('[out]')
//         .audioCodec('libmp3lame')
//         .audioBitrate(128)
//         .output(combinedOutputFile);

//     ////////console.log(6);
//     try {
//         ////////console.log(7);
//         // Execute the FFmpeg merge command and wait for it to finish
//         await new Promise((resolve, reject) => {
//             ////////console.log(8);
//             mergeCommand.on('end', resolve).on('error', (e) => {
//                 ////////console.log(e);
//                 reject(e)
//             }).run();
//             ////////console.log(9);
//         });

//         ////////console.log(10);
//         // Send the combined MP3 file as a response
//         res.setHeader('Content-Disposition', 'attachment; filename="combined_sound.mp3"');
//         ////////console.log(11);
//         res.download(combinedOutputFile, 'combined_sound.mp3', (err) => {
//             if (err) {
//                 res.status(500).send('Error during sending the file');
//             } else {
//                 // Remove the temporary combined MP3 file
//                 fs.unlinkSync(combinedOutputFile);
//             }
//         });
//     } catch (err) {
//         ////////console.log(err);
//         res.status(500).send('Error during audio processing');
//     }
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//     ////////console.log(`Music app server started on port ${PORT}`);
// });

// const express = require("express");
// const ffmpeg = require("fluent-ffmpeg");
// const fs = require("fs");
// const path = require("path");
// const cors = require("cors");

// require("dotenv").config({ path: "./.env" });

// const app = express();

// // Middlewares
// app.use(express.json());
// app.use(cors());
// app.use(express.static('public'));

// // POST endpoint for combining sounds
// app.post("/combine-sounds", async (req, res) => {

//     const { addedSounds } = req.body;

//     try {
//         // Check if addedSounds array is empty
//         if (!addedSounds || addedSounds.length === 0) {
//             throw new Error('No addedSounds provided');
//         }

//         // Extract segments and merge audio files
//         const mergedAudioFiles = await processAudioSegments(addedSounds);

//         // Send the combined MP3 file as a response
//         sendCombinedFile(res, mergedAudioFiles);

//     } catch (error) {
//         console.error('Error:', error.message);
//         res.status(500).send('Error during audio processing');
//     }
// });

// // Process audio segments and merge files
// async function processAudioSegments(addedSounds) {

//     const mergedFiles = {};

//     for (const segment of addedSounds) {

//         const { startingTime, endingTime, ...rest } = segment;
//         const duration = endingTime - startingTime;
//         const inputFile = path.join('public', rest.path);
//         const outputFile = `public/output_${startingTime}-${endingTime}.mp3`;

//         await new Promise((resolve, reject) => {
//             ffmpeg(inputFile)
//                 .setStartTime(startingTime)
//                 .setDuration(duration)
//                 .audioCodec('libmp3lame')
//                 .audioBitrate(128)
//                 .output(outputFile)
//                 .on('end', resolve)
//                 .on('error', reject)
//                 .run();
//         });

//         if (!mergedFiles[startingTime]) {
//             mergedFiles[startingTime] = [];
//         }

//         mergedFiles[startingTime].push(outputFile);
//     }

//     const mergedAudioFiles = [];

//     for (const key in mergedFiles) {
//         const mergedFile = await mergeAudioFiles(mergedFiles[key]);
//         mergedAudioFiles.push(mergedFile);
//     }

//     return mergedAudioFiles;

// }

// // Merge audio files with the same start time
// async function mergeAudioFiles(files) {
//     if (files.length === 1) {
//         return files[0];
//     }

//     const mergeCommand = ffmpeg();

//     files.forEach((file) => {
//         mergeCommand.input(file);
//     });

//     const outputFile = `public/merged_${files[0]}.mp3`;

//     await new Promise((resolve, reject) => {
//         mergeCommand
//             .complexFilter(`[0:a]amix=inputs=${files.length}:duration=first:dropout_transition=2[out]`)
//             .map('[out]')
//             .audioCodec('libmp3lame')
//             .audioBitrate(128)
//             .output(outputFile)
//             .on('end', resolve)
//             .on('error', reject)
//             .run();
//     });

//     return outputFile;

// }

// // Send the combined MP3 file as a response
// function sendCombinedFile(res, combinedFile) {

//     res.setHeader('Content-Disposition', 'attachment; filename="combined_sound.mp3"');

//     res.download(combinedFile, 'combined_sound.mp3', (err) => {
//         if (err) {
//             res.status(500).send('Error during sending the file');
//         } else {
//             // Remove the temporary combined MP3 file
//             fs.unlinkSync(combinedFile);
//         }
//     });
// }

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//     ////////console.log(`Music app server started on port ${PORT}`);
// });

// const express = require("express");
// const ffmpeg = require("fluent-ffmpeg");
// const fs = require("fs");
// const path = require("path");
// const cors = require("cors");

// require("dotenv").config({ path: "./.env" });

// const app = express();

// // Middlewares
// app.use(express.json());
// app.use(cors());
// app.use(express.static('public'));

// // POST endpoint for combining sounds
// app.post("/combine-sounds", async (req, res) => {
//     try {
//         const { addedSounds } = req.body;

//         // Check if addedSounds array is empty
//         if (!addedSounds || addedSounds.length === 0) {
//             return res.status(400).send('No addedSounds provided');
//         }

//         const audioFiles = [];

//         // Iterate over the addedSounds array and extract audio paths and durations
//         for (const segment of addedSounds) {
//             const { startingTime, endingTime, ...rest } = segment;
//             const duration = endingTime - startingTime;

//             // Use FFmpeg to extract the segment from the audio file
//             const inputFile = path.join('public', rest.path);
//             const outputFile = `public/segment_${startingTime}-${endingTime}.mp3`;

//             await new Promise((resolve, reject) => {
//                 ffmpeg(inputFile)
//                     .setStartTime(startingTime)
//                     .setDuration(duration)
//                     .audioCodec('libmp3lame')
//                     .audioBitrate(128)
//                     .output(outputFile)
//                     .on('end', resolve)
//                     .on('error', reject)
//                     .run();
//             });

//             audioFiles.push(path.join("public" , rest.path));
//         }

//         const combinedOutputFile = 'public/combined_sound.mp3';

//         // Merge the extracted segments using FFmpeg
//         await new Promise((resolve, reject) => {

//             const mergeCommand = ffmpeg();

//             audioFiles.forEach(file => mergeCommand.input(file));

//             mergeCommand
//                 .complexFilter(`[0:a]concat=n=${audioFiles.length}:v=0:a=1[out]`)
//                 .map('[out]')
//                 .audioCodec('libmp3lame')
//                 .audioBitrate(128)
//                 .output(combinedOutputFile)
//                 .on('end', resolve)
//                 .on('error', reject)
//                 .run();
//         });

//         // Send the combined MP3 file as a response
// res.setHeader('Content-Disposition', 'attachment; filename="combined_sound.mp3"');
// res.download(combinedOutputFile, 'combined_sound.mp3', (err) => {
//     if (err) {
//         res.status(500).send('Error during sending the file');
//     } else {
//         // Remove the temporary combined MP3 file
//         fs.unlinkSync(combinedOutputFile);
//     }
// });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Error during audio processing');
//     }
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//     ////////console.log(`Music app server started on port ${PORT}`);
// });

// const express = require("express");
// const ffmpeg = require("fluent-ffmpeg");
// const fs = require("fs");
// const path = require("path");
// const cors = require("cors");

// require("dotenv").config({ path: "./.env" });

// const app = express();

// // Middlewares
// app.use(express.json());
// app.use(cors());
// app.use(express.static('public'));

// // POST endpoint for combining sounds
// app.post("/combine-sounds", async (req, res) => {

//     try {
//         const { addedSounds } = req.body;

//         ////////console.log(addedSounds);

//         // Check if addedSounds array is empty
//         if (!addedSounds || addedSounds.length === 0) {
//             return res.status(400).send('No addedSounds provided');
//         }

//         // Construct the FFmpeg command
//         const ffmpegCommand = ffmpeg();
//         const complexFilterParts = [];

//         addedSounds.forEach((segment, index) => {

//             const { startingTime, endingTime ,  ...rest } = segment;

//             const inputFile = path.join(__dirname, 'public', rest.path);

//             ffmpegCommand.input(inputFile).inputOptions(`-ss ${startingTime}`).inputOptions(`-to ${endingTime}`);

//             complexFilterParts.push(`[${index}:a]atrim=${startingTime}:${endingTime - startingTime}[a${index}]`);

//         });

//         const complexFilter = complexFilterParts.join('; ');

//         const amixFilter = `[${complexFilterParts.map((_, index) => `a${index}`).join('][')}]amix=inputs=${addedSounds.length}:duration=longest:dropout_transition=0`;

//         const finalFilter = `${complexFilter}; ${amixFilter}`;

//         const combinedOutputFile = 'public/output.mp3';

//         ffmpegCommand
//             .complexFilter(finalFilter)
//             .audioCodec('libmp3lame')
//             .audioBitrate(128)
//             .save(combinedOutputFile) // Specify the output file path
//             .on('start', (commandLine) => {
//                 ////////console.log('FFmpeg command:', commandLine); // Log FFmpeg command
//             })
//             .on('stderr', (stderrLine) => {
//                 console.error('FFmpeg stderr:', stderrLine); // Log FFmpeg stderr output
//             });

//         // Send the combined MP3 file as a response
// res.setHeader('Content-Disposition', 'attachment; filename="combined_sound.mp3"');
// res.download(combinedOutputFile, 'combined_sound.mp3', (err) => {
//     if (err) {
//         console.error('Error during sending the file:', err); // Log the error
//         res.status(500).send('Error during sending the file: ' + err.message); // Send detailed error message to the client
//     } else {
//         ////////console.log('File sent successfully');
//         // Remove the temporary combined MP3 file
//         fs.unlinkSync(combinedOutputFile);
//     }
// });

//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Error during audio processing');
//     }

// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//     ////////console.log(`Music app server started on port ${PORT}`);
// });

// const express = require("express");
// const ffmpeg = require("fluent-ffmpeg");
// const fs = require("fs");
// const path = require("path");
// const cors = require("cors");

// const app = express();

// require("dotenv").config({ path: "./.env" });

// // Middlewares
// app.use(express.json());
// app.use(cors());
// app.use(express.static('public'));

// app.listen(5000, () => {
//     ////////console.log("Server is running on port 5000");
// });

// app.post("/combine-sounds", async (req, res) => {

//     try {
//         const { addedSounds, userFileName } = req.body;

//         // Create a command using fluent-ffmpeg
//         const command = ffmpeg();

//         const combinedOutputFile = `public\\${userFileName}.mp3`;
//         // Loop through each sound in the request
//         for (const sound of addedSounds) {

//             const { startingTime, path } = sound;

//             // Add input file to ffmpeg command
//             command.input(`public//${path.replace("/", "\\")}`).seekInput(startingTime);
//         }

//         // Apply amix filter to merge input streams
//         command.complexFilter('amix=inputs=2:duration=first:dropout_transition=3');

//         // Set output format and file
//         command
//             .output(combinedOutputFile)
//             .on("end", () => {
//                 res.setHeader('Content-Disposition', 'attachment; filename="combined_sound.mp3"');
//                 res.download(combinedOutputFile, `${userFileName}.mp3`, (err) => {
//                     if (err) {
//                         console.error('Error during sending the file:', err); // Log the error
//                         res.status(500).send('Error during sending the file: ' + err.message); // Send detailed error message to the client
//                     } else {
//                         ////////console.log('File sent successfully');
//                         // Remove the temporary combined MP3 file
//                         fs.unlinkSync(combinedOutputFile);
//                     }
//                 });
//             })
//             .on("error", (err) => {
//                 console.error("Error merging files:", err);
//                 res.status(500).send("Error merging files");
//             })
//             .run();

//     } catch (err) {
//         console.error("Error:", err);
//         res.status(500).send("Internal Server Error");
//     }
// });

const express = require("express");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

require("dotenv").config({ path: "./.env" });

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.listen(5005, () => {
  console.log("Server is running on port 5005");
});

app.post("/combine-sounds", async (req, res) => {
  try {
    const { addedSounds, userFileName } = req.body;

    if (addedSounds.length === 0 || !userFileName) {
      return res.status(400).json({ msg: "حدث خطأ أثناء عملية الحفظ." });
    }

    // Create a command using fluent-ffmpeg
    const command = ffmpeg();

    // Build complex filter expression dynamically based on input addedSounds
    let complexFilterExpression = "";

    for (let i = 0; i < addedSounds.length; i++) {
      const { startingTime, endingTime, path } = addedSounds[i];

      command.input(`public\\${path.replace("/", "\\")}`);

      // Add adelay and atrim filters for each sound
      complexFilterExpression += `[${i}:a]adelay=${Math.floor(
        startingTime * 1000
      )}|${Math.floor(startingTime * 1000)},atrim=0:${(
        (endingTime - startingTime) *
        1000
      ).toFixed(3)},asetpts=PTS-STARTPTS[s${i}];`;
    }

    // Concatenate the sounds
    for (let i = 0; i < addedSounds.length; i++) {
      complexFilterExpression += `[s${i}]`;
    }

    complexFilterExpression += `amix=inputs=${addedSounds.length}:dropout_transition=3`;

    // Apply complex filter
    command.complexFilter(complexFilterExpression);

    const combinedOutputFile = `public\\${userFileName}.mp3`;

    // Set output format and file
    command
      .output(combinedOutputFile)

      .on("end", () => {
        ////////console.log("Merging complete");
        res
          .setHeader(
            "Content-Disposition",
            'attachment; filename="combined_sound.mp3"'
          )
          .download(combinedOutputFile, `${userFileName}.mp3`, (err) => {
            if (err) {
              ////////console.log(err);
              console.error("Error during sending the file:", err); // Log the error
              // res.status(500).send('Error during sending the file: ' + err.message); // Send detailed error message to the client
            } else {
              ////////console.log('File sent successfully');
              // Remove the temporary combined MP3 file
              fs.unlinkSync(combinedOutputFile);
            }
          });
      })

      .on("error", (err) => {
        console.error("Error merging files:", err);
        res.status(500).send("Error merging files");
      })

      .run();
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
});
