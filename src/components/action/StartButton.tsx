import React from "react";
import {Button,} from "@material-ui/core";
import {invoke, promisified} from "tauri/api/tauri";
import {PlayArrow} from "@material-ui/icons";
import {LauncherProfile} from "../../interfaces/LauncherAccount";
import {Version} from "../../interfaces/Version";
import {createDir, readTextFile} from "tauri/api/fs";
import {MCJson} from "../../interfaces/MCJson";
import axios from "axios";
import {bytesToBase64} from "byte-base64";

interface Props {
  profile: LauncherProfile
  version: Version
  setStatus: (status: string) => void;
  status: string
}

export const StartButton = (props: Props) => {

  const checkForInstalledNatives = async (mcDir: string, os: string) => {
    props.setStatus(`Checking for ${props.version.assetIndex} Natives`)
    const [lwjgl, lwjglFolder] = getNatives(mcDir, os);
    await promisified<boolean>({
      cmd: "fileExists",
      path: lwjglFolder
    }).then(async hasNatives => {
      if (hasNatives) {
        props.setStatus("Found natives")
      } else {
        props.setStatus("Installing natives")
        let response = await axios({
          url: "/downloads/" + lwjgl + ".zip",
          method: 'GET',
          responseType: 'arraybuffer', // Important
        });
        await promisified({
          cmd: 'writeBinFile',
          path: mcDir + "/norisk/" + lwjgl + ".zip",
          contents: bytesToBase64(new Uint8Array(response.data)),
        }).then(async value => {
          //TODO EXTRACT FILE
          await promisified({
            cmd: "extractZip",
            src: mcDir + "/norisk/" + lwjgl + ".zip",
            dest: mcDir + "/norisk/natives"
          })
        });
      }
    })
  }

  const getNatives = (mcDir: string, os: string) => {
    let lwjglFolder = "";
    let lwjgl = "";
    let nativePath = "";
    if (props.version.assetIndex === "1.8") {
      lwjgl = "lwjgl-2.9.3";
      lwjglFolder = mcDir + "/norisk/natives/" + lwjgl;
    } else if (props.version.assetIndex === "1.16") {
      lwjgl = "lwjgl-3.2.2";
      lwjglFolder = mcDir + "/norisk/natives/" + lwjgl;
    }
    nativePath = lwjglFolder + "/native/" + os;
    return [lwjgl, lwjglFolder, nativePath];
  }

  const createNRCFolder = async (mcDir: string, os: string) => {
    await createDir(mcDir + "/norisk").then(() => {
      props.setStatus("Creating norisk folder")
    }).catch(() => {
      props.setStatus("Found norisk folder")
    })
    await createDir(mcDir + "/norisk/natives").then(() => {
      props.setStatus("Creating natives folder")
    }).catch(() => {
      props.setStatus("Found natives folder")
    })
    await checkForInstalledNatives(mcDir, os);
  }

  const startGame = async () => {
    props.setStatus("Checking for Files");
    const profile = props.profile;
    const version = props.version;
    const OS = await promisified<string>({cmd: "os"}).then((value) => {
      props.setStatus(value)
      return value;
    });
    const mcDir = await promisified<string>({cmd: "minecraftDir"}).then((value) => {
      props.setStatus("Found .minecraft folder")
      return value;
    });
    await createNRCFolder(mcDir, OS);
    const [lwjgl, lwjglFolder, nativePath] = getNatives(mcDir, OS);
    console.log(lwjgl, lwjglFolder, nativePath)
    const mcJson = JSON.parse(await readTextFile(mcDir + version.jsonPath, {})) as MCJson;
    let libraries = "";
    mcJson.libraries.forEach(value => {
      const path = value.name.substr(0, value.name.indexOf(":")).replaceAll(".", "/");
      const jarName = value.name.substr(value.name.indexOf(":") + 1, value.name.length).substr(0, value.name.substr(value.name.indexOf(":") + 1, value.name.length).indexOf(":"));
      const versionNumber = value.name.substr(value.name.lastIndexOf(":") + 1, value.name.length)
      libraries = libraries + (mcDir + "/libraries/" + path + value.name.substr(value.name.indexOf(":"), value.name.length).replaceAll(":", "/") + "/" + jarName + "-" + versionNumber + ".jar" + ";");
    })
    libraries = libraries + `${mcDir + version.jarPath}`;
    console.log(libraries)
    console.log(mcJson.mainClass)
    console.log(version.libraries?.replaceAll("MCDIR", mcDir))
    console.log(nativePath)
    console.log(profile.accessToken)
    console.log(profile.minecraftProfile.name)
    invoke({
      cmd: 'startGame',
      program: "java",
      args: [
        `-Xms1024M`,
        `-Xmx1024M`,
        `-XX:HeapDumpPath=MojangTricksIntelDriversForPerformance_javaw.exe_minecraft.exe.heapdump`,
        `-Djava.library.path=${nativePath}`,
        `-Dminecraft.client.jar=${mcDir + "/versions/1.8.9-NoRiskClient/1.8.9-NoRiskClient.jar"}`,
        `-cp`,
        `${version.libraries?.replaceAll("MCDIR", mcDir)}`,
        `${mcJson.mainClass}`,
        `--version`, version.folderName,
        `--gameDir`, mcDir,
        `--assetsDir`, mcDir + "/assets",
        `--username`, profile.minecraftProfile.name,
        `--assetIndex`, version.assetIndex,
        `--uuid`, profile.minecraftProfile.id,
        `--accessToken`, profile.accessToken,
        `--userProperties`, profile.userProperites.length === 0 ? "" : profile.userProperites.length,
        `--userType`, profile.type,
        `${version.tweakClass}`
      ],
      workingDir: mcDir,
      callback: "",
      error: "",
    })
  }

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={startGame}
      startIcon={<PlayArrow/>}>
      {props.status}
    </Button>
  );
}

