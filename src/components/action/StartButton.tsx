import React from "react";
import {Button, createStyles, makeStyles, Theme, useTheme,} from "@material-ui/core";
import {invoke, promisified} from "tauri/api/tauri";
import {PlayArrow} from "@material-ui/icons";
import {LauncherProfile} from "../interfaces/LauncherAccount";

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
        await invoke({
          cmd: 'startGame',
          program: "java",
          args: [
            `-Xms1024M`,
            `-Xmx1024M`,
            `-XX:HeapDumpPath=MojangTricksIntelDriversForPerformance_javaw.exe_minecraft.exe.heapdump`,
            `-Djava.library.path=${program}`,
            `-cp`,
            `${mcDir}/libraries/net/sf/jopt-simple/jopt-simple/4.6/jopt-simple-4.6.jar;
                        ${mcDir}/libraries/net/minecraft/launchwrapper/1.12/launchwrapper-1.12.jar;
                        ${mcDir}/libraries/org/ow2/asm/asm-all/5.2/asm-all-5.2.jar;
                        ${mcDir}/libraries/org/jline/jline/3.5.1/jline-3.5.1.jar;
                        ${mcDir}/libraries/net/java/dev/jna/jna/4.4.0/jna-4.4.0.jar;
                        ${mcDir}/libraries/com/typesafe/akka/akka-actor_2.11/2.3.3/akka-actor_2.11-2.3.3.jar;
                        ${mcDir}/libraries/com/typesafe/config/1.2.1/config-1.2.1.jar;
                        ${mcDir}/libraries/org/scala-lang/scala-actors-migration_2.11/1.1.0/scala-actors-migration_2.11-1.1.0.jar;
                        ${mcDir}/libraries/org/scala-lang/scala-compiler/2.11.1/scala-compiler-2.11.1.jar;
                        ${mcDir}/libraries/org/scala-lang/plugins/scala-continuations-library_2.11/1.0.2/scala-continuations-library_2.11-1.0.2.jar;
                        ${mcDir}/libraries/org/scala-lang/plugins/scala-continuations-plugin_2.11.1/1.0.2/scala-continuations-plugin_2.11.1-1.0.2.jar;
                        ${mcDir}/libraries/org/scala-lang/scala-library/2.11.1/scala-library-2.11.1.jar;
                        ${mcDir}/libraries/org/scala-lang/scala-parser-combinators_2.11/1.0.1/scala-parser-combinators_2.11-1.0.1.jar;
                        ${mcDir}/libraries/org/scala-lang/scala-reflect/2.11.1/scala-reflect-2.11.1.jar;
                        ${mcDir}/libraries/org/scala-lang/scala-swing_2.11/1.0.1/scala-swing_2.11-1.0.1.jar;
                        ${mcDir}/libraries/org/scala-lang/scala-xml_2.11/1.0.2/scala-xml_2.11-1.0.2.jar;
                        ${mcDir}/libraries/lzma/lzma/0.0.1/lzma-0.0.1.jar;
                        ${mcDir}/libraries/net/sf/jopt-simple/jopt-simple/4.6/jopt-simple-4.6.jar;
                        ${mcDir}/libraries/java3d/vecmath/1.5.2/vecmath-1.5.2.jar;
                        ${mcDir}/libraries/net/sf/trove4j/trove4j/3.0.3/trove4j-3.0.3.jar;
                        ${mcDir}/libraries/org/apache/maven/maven-artifact/3.5.3/maven-artifact-3.5.3.jar;
                        ${mcDir}/libraries/com/mojang/patchy/1.1/patchy-1.1.jar;
                        ${mcDir}/libraries/oshi-project/oshi-core/1.1/oshi-core-1.1.jar;
                        ${mcDir}/libraries/net/java/dev/jna/jna/4.4.0/jna-4.4.0.jar;
                        ${mcDir}/libraries/net/java/dev/jna/platform/3.4.0/platform-3.4.0.jar;
                        ${mcDir}/libraries/com/ibm/icu/icu4j-core-mojang/51.2/icu4j-core-mojang-51.2.jar;
                        ${mcDir}/libraries/net/sf/jopt-simple/jopt-simple/4.6/jopt-simple-4.6.jar;
                        ${mcDir}/libraries/com/paulscode/codecjorbis/20101023/codecjorbis-20101023.jar;
                        ${mcDir}/libraries/com/paulscode/codecwav/20101023/codecwav-20101023.jar;
                        ${mcDir}/libraries/com/paulscode/libraryjavasound/20101123/libraryjavasound-20101123.jar;
                        ${mcDir}/libraries/com/paulscode/librarylwjglopenal/20100824/librarylwjglopenal-20100824.jar;
                        ${mcDir}/libraries/com/paulscode/soundsystem/20120107/soundsystem-20120107.jar;
                        ${mcDir}/libraries/io/netty/netty-all/4.1.9.Final/netty-all-4.1.9.Final.jar;
                        ${mcDir}/libraries/com/google/guava/guava/21.0/guava-21.0.jar;
                        ${mcDir}/libraries/org/apache/commons/commons-lang3/3.5/commons-lang3-3.5.jar;
                        ${mcDir}/libraries/commons-io/commons-io/2.5/commons-io-2.5.jar;
                        ${mcDir}/libraries/commons-codec/commons-codec/1.10/commons-codec-1.10.jar;
                        ${mcDir}/libraries/net/java/jinput/jinput/2.0.5/jinput-2.0.5.jar;
                        ${mcDir}/libraries/net/java/jutils/jutils/1.0.0/jutils-1.0.0.jar;
                        ${mcDir}/libraries/com/google/code/gson/gson/2.8.0/gson-2.8.0.jar;
                        ${mcDir}/libraries/com/mojang/authlib/1.5.25/authlib-1.5.25.jar;
                        ${mcDir}/libraries/com/mojang/realms/1.10.22/realms-1.10.22.jar;
                        ${mcDir}/libraries/org/apache/commons/commons-compress/1.8.1/commons-compress-1.8.1.jar;
                        ${mcDir}/libraries/org/apache/httpcomponents/httpclient/4.3.3/httpclient-4.3.3.jar;
                        ${mcDir}/libraries/commons-logging/commons-logging/1.1.3/commons-logging-1.1.3.jar;
                        ${mcDir}/libraries/org/apache/httpcomponents/httpcore/4.3.2/httpcore-4.3.2.jar;
                        ${mcDir}/libraries/it/unimi/dsi/fastutil/7.1.0/fastutil-7.1.0.jar;
                        ${mcDir}/libraries/org/apache/logging/log4j/log4j-api/2.8.1/log4j-api-2.8.1.jar;
                        ${mcDir}/libraries/org/apache/logging/log4j/log4j-core/2.8.1/log4j-core-2.8.1.jar;
                        ${mcDir}/libraries/org/lwjgl/lwjgl/lwjgl/2.9.4-nightly-20150209/lwjgl-2.9.4-nightly-20150209.jar;
                        ${mcDir}/libraries/org/lwjgl/lwjgl/lwjgl_util/2.9.4-nightly-20150209/lwjgl_util-2.9.4-nightly-20150209.jar;
                        ${mcDir}/libraries/org/lwjgl/lwjgl/lwjgl-platform/2.9.4-nightly-20150209/lwjgl-platform-2.9.4-nightly-20150209.jar;
                        ${mcDir}/libraries/org/lwjgl/lwjgl/lwjgl/2.9.2-nightly-20140822/lwjgl-2.9.2-nightly-20140822.jar;
                        ${mcDir}/libraries/org/lwjgl/lwjgl/lwjgl_util/2.9.2-nightly-20140822/lwjgl_util-2.9.2-nightly-20140822.jar;
                        ${mcDir}/libraries/com/mojang/text2speech/1.10.3/text2speech-1.10.3.jar;
                        ${mcDir}/libraries/com/mojang/text2speech/1.10.3/text2speech-1.10.3.jar;
                        ${mcDir}/libraries/ca/weblite/java-objc-bridge/1.0.0/java-objc-bridge-1.0.0.jar;
                        ${mcDir}/libraries/ca/weblite/java-objc-bridge/1.0.0/java-objc-bridge-1.0.0.jar`,
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
          ]
        })
      }}
      startIcon={<PlayArrow/>}
    >
      Start
    </Button>
  );
};

