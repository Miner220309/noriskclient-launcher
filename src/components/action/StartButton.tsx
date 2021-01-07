import React from "react";
import {Button} from "@material-ui/core";
import {invoke, promisified} from "tauri/api/tauri";
import {PlayArrow} from "@material-ui/icons";
import {LauncherProfile} from "../../interfaces/LauncherAccount";
import {Version} from "../../interfaces/Version";
import {createDir} from "tauri/api/fs";
import axios from "axios";
import {bytesToBase64} from "byte-base64";

interface Props {
  profile: LauncherProfile;
  version: Version;
  setStatus: (status: string) => void;
  status: string;
}

export const StartButton = (props: Props) => {
  const checkForInstalledNatives = async (mcDir: string, os: string) => {
    props.setStatus(`Checking for ${props.version.assetIndex} Natives`);
    const [lwjgl, lwjglFolder] = getNatives(mcDir, os);
    const hasNatives = await promisified<boolean>({
      cmd: "fileExists",
      path: lwjglFolder
    })
    if (hasNatives) {
      props.setStatus("Found natives")
    } else {
      props.setStatus("Installing natives")
      downloadAndWriteFile(mcDir + "/norisk/" + lwjgl + ".zip", "/downloads/" + lwjgl + ".zip", lwjgl).then(async () => {
          await promisified({
            cmd: "extractZip",
            src: mcDir + "/norisk/" + lwjgl + ".zip",
            dest: mcDir + "/norisk/natives"
          })
        }
      )
    }
  }

  const checkForInstalledLaunchWrapper = async (mcDir: string, os: string) => {
    props.setStatus(`Checking for Launchwrapper`);
    const hasLaunchWrapper = await promisified<boolean>({
      cmd: "fileExists",
      path: mcDir + "/libraries/net/minecraft/launchwrapper/1.12/launchwrapper-1.12.jar"
    })
    if (hasLaunchWrapper) {
      props.setStatus("Found launchwrapper")
    } else {
      props.setStatus("Installing launchwrapper")
      // @ts-ignore
      return await createDir(mcDir + "/libraries/net/minecraft/launchwrapper/1.12/", {recursive: true}).then(async () => {
        return await downloadAndWriteFile(mcDir + "/libraries/net/minecraft/launchwrapper/1.12/launchwrapper-1.12.jar", "/downloads/launchwrapper-1.12.jar", "Launchwrapper");
      })
    }
  }

  const downloadAndWriteFile = async (path: string, url: string, toDownload: string) => {
    let response = await axios({
      url: url,
      method: 'GET',
      responseType: 'arraybuffer',
      onDownloadProgress: progressEvent => {
        props.setStatus(`Downloading ${toDownload} ${Math.round((progressEvent.loaded * 100) / progressEvent.total)}%`)
      }
    });
    return await promisified({
      cmd: 'writeBinFile',
      path: path,
      contents: bytesToBase64(new Uint8Array(response.data)),
    });
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
  };

  const createNRCFolder = async (mcDir: string, os: string) => {
    // @ts-ignore
    return await createDir(mcDir + "/norisk/natives", {recursive: true}).then(async () => {
      props.setStatus("Checking for norisk folder")
      return Promise.all([await checkForInstalledNatives(mcDir, os), await checkForInstalledLaunchWrapper(mcDir, os)])
    })
  }

  const startNoRiskForge = async (mcDir: string) => {
    // @ts-ignore
    return await createDir(mcDir + "/mods/1.8.9", {recursive: true}).then(async () => {
      props.setStatus("Checking for forge mods folder")
      const hasNoRiskMod = await promisified<boolean>({
        cmd: "fileExists",
        path: mcDir + "/mods/1.8.9/NoRiskClient.jar",
      })
      const hasForgeLoader = await promisified<boolean>({
        cmd: "fileExists",
        path: mcDir + "/libraries/de/noriskclient/forge/1.8.9/forge-1.8.9.jar",
      })
      if (hasNoRiskMod && hasForgeLoader) {
        //TODO check for updates
      } else {
        let noriskModDownload;
        let optifineModDownload;
        let forgeLoaderDownload;
        if (!hasNoRiskMod) {
          noriskModDownload = await downloadAndWriteFile(mcDir + "/mods/1.8.9/NoRiskClient-1.8.9.jar", "/downloads/client/latest.jar", "NoRiskClient-Forge")
          optifineModDownload = await downloadAndWriteFile(mcDir + "/mods/1.8.9/Optifine-1.8.9.jar", "/downloads/optifine_1.8.9.zip", "Optifine")
        }
        if (!hasForgeLoader) {
          // @ts-ignore
          forgeLoaderDownload = await createDir(mcDir + "/libraries/de/noriskclient/forge/1.8.9", {recursive: true}).then(async () => {
            return await downloadAndWriteFile(mcDir + "/libraries/de/noriskclient/forge/1.8.9/forge-1.8.9.jar", "downloads/forge_1.8.9.jar", "Forge 1.8.9");
          })
        }
        return Promise.all([noriskModDownload, optifineModDownload, forgeLoaderDownload]);
      }
    })
  }

  const startNoRiskStandAlone = async (mcDir: string) => {
    // @ts-ignore
    return await createDir(mcDir + "/libraries/de/noriskclient/NoRiskClient/1.8.9", {recursive: true}).then(async () => {
      props.setStatus("Checking for norisk-Libraries")
      const hasLibrary = await promisified<boolean>({
        cmd: "fileExists",
        path: mcDir + "/libraries/de/noriskclient/NoRiskClient/1.8.9/1.8.9-NoRiskClient.jar",
      })
      const hasVersionsFolder = await promisified<boolean>({
        cmd: "fileExists",
        path: mcDir + "/versions/1.8.9-NoRiskClient/1.8.9-NoRiskClient.jar",
      })
      if (hasLibrary && hasVersionsFolder) {
        //TODO check for updates
      } else {
        // @ts-ignore
        return await createDir(mcDir + "/versions/1.8.9-NoRiskClient/", {recursive: true}).then(async () => {
          await downloadAndWriteFile(mcDir + "/versions/1.8.9-NoRiskClient/1.8.9-NoRiskClient.json", "downloads/client/1.8.9-NoRiskClient.json", "NoRiskClient JSON");
          await downloadAndWriteFile(mcDir + "/versions/1.8.9-NoRiskClient/1.8.9-NoRiskClient.jar", "downloads/mc_1.8.9.jar", "Minecraft 1.8.9");
        }).then(async () => {
          return downloadAndWriteFile(mcDir + "/libraries/de/noriskclient/NoRiskClient/1.8.9/NoRiskClient-1.8.9.jar", "/downloads/client/latest.jar", "NoRiskClient 1.8.9")
        })
      }
    })
  }

  const launchMinecraft = async (nativePath: string, mcDir: string) => {
    const profile = props.profile;
    const version = props.version;
    await invoke({
      cmd: 'startGame',
      program: "java",
      args: [
        `-Xms1024M`,
        `-Xmx1024M`,
        `-XX:HeapDumpPath=MojangTricksIntelDriversForPerformance_javaw.exe_minecraft.exe.heapdump`,
        `-Djava.library.path=${nativePath}`,
        `-Dminecraft.client.jar=${
          mcDir + "/versions/1.8.9-NoRiskClient/1.8.9-NoRiskClient.jar"
        }`,
        `-cp`,
        `${version.libraries?.replaceAll("MCDIR", mcDir)}`,
        `${version.mainClass}`,
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
    });
  };

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
    const [lwjgl, lwjglFolder, nativePath] = getNatives(mcDir, OS);
    await createNRCFolder(mcDir, OS).then(() => {
      if (version.name === "1.8.9 Standalone") {
        startNoRiskStandAlone(mcDir).then(() => {
          launchMinecraft(nativePath, mcDir)
        });
      } else if (version.name === "1.8.9 Forge") {
        startNoRiskForge(mcDir).then(() => {
          launchMinecraft(nativePath, mcDir);
        })
      }
    });
    props.setStatus("Starting Game")

  }

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={startGame}
      startIcon={<PlayArrow/>}
    >
      {props.status}
    </Button>
  );
};
