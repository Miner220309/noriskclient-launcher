import React from "react";
import {Button, createStyles, makeStyles, Theme, useTheme,} from "@material-ui/core";
import {promisified} from "tauri/api/tauri";
import {PlayArrow} from "@material-ui/icons";
import {LauncherProfile} from "../../interfaces/LauncherAccount";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
      position: "absolute",
      bottom: 0,
    },
  })
);

interface Props {
  profile: LauncherProfile
}

export const StartButton = (props: Props) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  return (
    <Button
      variant="contained"
      color="primary"
      className={classes.button}
      onClick={async () => {
        const profile = props.profile;
        const mcDir = await promisified({cmd: "minecraftDir"});
        const program = await mcDir + "/versions/1.8.9-NoRiskClient/natives";
        console.log(program)
        await promisified({
          cmd: 'startGame',
          program: "java",
          args: [
            `-Xms1024M`,
            `-Xmx1024M`,
            `-XX:HeapDumpPath=MojangTricksIntelDriversForPerformance_javaw.exe_minecraft.exe.heapdump`,
            `-Djava.library.path=${program}`,
            `-Dminecraft.client.jar=${mcDir + "/versions/1.8.9-NoRiskClient/1.8.9-NoRiskClient.jar"}`,
            `-cp`,
            `${mcDir}/libraries/com/mojang/netty/1.6/netty-1.6.jar;${mcDir}/libraries/oshi-project/oshi-core/1.1/oshi-core-1.1.jar;${mcDir}/libraries/net/java/dev/jna/jna/3.4.0/jna-3.4.0.jar;${mcDir}/libraries/net/java/dev/jna/platform/3.4.0/platform-3.4.0.jar;${mcDir}/libraries/com/ibm/icu/icu4j-core-mojang/51.2/icu4j-core-mojang-51.2.jar;${mcDir}/libraries/net/sf/jopt-simple/jopt-simple/4.6/jopt-simple-4.6.jar;${mcDir}/libraries/com/paulscode/codecjorbis/20101023/codecjorbis-20101023.jar;${mcDir}/libraries/com/paulscode/codecwav/20101023/codecwav-20101023.jar;${mcDir}/libraries/com/paulscode/libraryjavasound/20101123/libraryjavasound-20101123.jar;${mcDir}/libraries/com/paulscode/librarylwjglopenal/20100824/librarylwjglopenal-20100824.jar;${mcDir}/libraries/com/paulscode/soundsystem/20120107/soundsystem-20120107.jar;${mcDir}/libraries/io/netty/netty-all/4.0.23.Final/netty-all-4.0.23.Final.jar;${mcDir}/libraries/com/google/guava/guava/17.0/guava-17.0.jar;${mcDir}/libraries/org/apache/commons/commons-lang3/3.3.2/commons-lang3-3.3.2.jar;${mcDir}/libraries/commons-io/commons-io/2.4/commons-io-2.4.jar;${mcDir}/libraries/commons-codec/commons-codec/1.9/commons-codec-1.9.jar;${mcDir}/libraries/net/java/jinput/jinput/2.0.5/jinput-2.0.5.jar;${mcDir}/libraries/net/java/jutils/jutils/1.0.0/jutils-1.0.0.jar;${mcDir}/libraries/com/google/code/gson/gson/2.2.4/gson-2.2.4.jar;${mcDir}/libraries/com/mojang/authlib/1.5.21/authlib-1.5.21.jar;${mcDir}/libraries/com/mojang/realms/1.7.59/realms-1.7.59.jar;${mcDir}/libraries/org/apache/commons/commons-compress/1.8.1/commons-compress-1.8.1.jar;${mcDir}/libraries/org/apache/httpcomponents/httpclient/4.3.3/httpclient-4.3.3.jar;${mcDir}/libraries/commons-logging/commons-logging/1.1.3/commons-logging-1.1.3.jar;${mcDir}/libraries/org/apache/httpcomponents/httpcore/4.3.2/httpcore-4.3.2.jar;${mcDir}/libraries/org/apache/logging/log4j/log4j-api/2.0-beta9/log4j-api-2.0-beta9.jar;${mcDir}/libraries/org/apache/logging/log4j/log4j-core/2.0-beta9/log4j-core-2.0-beta9.jar;${mcDir}/libraries/org/lwjgl/lwjgl/lwjgl/2.9.4-nightly-20150209/lwjgl-2.9.4-nightly-20150209.jar;${mcDir}/libraries/org/lwjgl/lwjgl/lwjgl_util/2.9.4-nightly-20150209/lwjgl_util-2.9.4-nightly-20150209.jar;${mcDir}/libraries/tv/twitch/twitch/6.5/twitch-6.5.jar;${mcDir}/libraries/de/noriskclient/NoRiskClient/1.8.9/NoRiskClient-1.8.9.jar;${mcDir}/libraries/net/minecraft/launchwrapper/1.12/launchwrapper-1.12.jar;${mcDir}/versions/1.8.9-NoRiskClient/1.8.9-NoRiskClient.jar`,
            `net.minecraft.launchwrapper.Launch`,
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
          workingDir: mcDir
        })
      }}
      startIcon={<PlayArrow/>}
    >
      Start
    </Button>
  );
};

