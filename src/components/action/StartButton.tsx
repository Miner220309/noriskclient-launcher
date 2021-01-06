import React from "react";
import {Button,} from "@material-ui/core";
import {invoke, promisified} from "tauri/api/tauri";
import {PlayArrow} from "@material-ui/icons";
import {LauncherProfile} from "../../interfaces/LauncherAccount";
import {Version} from "../../interfaces/Version";
import {readTextFile} from "tauri/api/fs";
import {MCJson} from "../../interfaces/MCJson";


interface Props {
  profile: LauncherProfile
  version: Version
}

export const StartButton = (props: Props) => {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={async () => {
        const profile = props.profile;
        const version = props.version;
        const mcDir = await promisified({cmd: "minecraftDir"});
        const program = await mcDir + "/versions/1.8.9-NoRiskClient/natives";
        const mcJson = JSON.parse(await readTextFile(mcDir + version.jsonPath, {})) as MCJson;
        let libraries = "";
        mcJson.libraries.forEach(value => {
          const path = value.name.substr(0, value.name.indexOf(":")).replaceAll(".", "/");
          const jarName = value.name.substr(value.name.indexOf(":") + 1, value.name.length).substr(0, value.name.substr(value.name.indexOf(":") + 1, value.name.length).indexOf(":"));
          const versionNumber = value.name.substr(value.name.lastIndexOf(":") + 1, value.name.length)
          libraries = libraries + (mcDir + "/libraries/" + path + value.name.substr(value.name.indexOf(":"), value.name.length).replaceAll(":", "/") + "/" + jarName + "-" + versionNumber + ".jar" + ";");
        })
        libraries = libraries.substr(0, libraries.lastIndexOf(";"));
        console.log(libraries)
        console.log(mcJson.mainClass)
        invoke({
          cmd: 'startGame',
          program: "java",
          args: [
            `-Xms1024M`,
            `-Xmx1024M`,
            `-XX:HeapDumpPath=MojangTricksIntelDriversForPerformance_javaw.exe_minecraft.exe.heapdump`,
            `-Djava.library.path=${program}`,
            `-Dminecraft.client.jar=${mcDir + "/versions/1.8.9-NoRiskClient/1.8.9-NoRiskClient.jar"}`,
            `-cp`,
            `${libraries}`,
            `${mcJson.mainClass}`,
            `--version`, "1.8.9-NoRiskClient",
            `--gameDir`, mcDir,
            `--assetsDir`, mcDir + "/assets",
            `--username`, profile.minecraftProfile.name,
            `--assetIndex`, "1.8",
            `--uuid`, profile.minecraftProfile.id,
            `--accessToken`, profile.accessToken,
            `--userProperties`, profile.userProperites.length === 0 ? "" : profile.userProperites.length,
            `--userType`, profile.type,
            `--tweakClass=de.noriskclient.norisk.asm.ClassTweaker`
          ],
          workingDir: mcDir,
          callback: "",
          error: "",
        })
      }}
      startIcon={<PlayArrow/>}>
      Start
    </Button>
  );
}

