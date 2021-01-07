use regex::Regex;
use std::{
    fs::{File, OpenOptions},
    io::{self, Read, Seek, Write},
    path::Path,
};
use tauri::Result;
use zip::{
    read::ZipArchive,
    write::{FileOptions, ZipWriter},
};

pub fn extract<S: AsRef<Path>, D: AsRef<Path>>(src: S, dest: D) -> Result<()> {
    Ok(ZipArchive::new(File::open(src)?)?.extract(dest)?)
}

pub fn merge<S: AsRef<Path>, D: AsRef<Path>>(
    src: S,
    dest: D,
    exclude: Option<&Regex>,
) -> Result<()> {
    let mut src_archive = ZipArchive::new(File::open(src)?)?;
    let mut dest_archive = ZipWriter::new(OpenOptions::new().append(true).open(dest)?);
    copy_entries(&mut src_archive, &mut dest_archive, exclude)
}

fn copy_entries<R: Read + Seek, W: Write + Seek>(
    src: &mut ZipArchive<R>,
    dest: &mut ZipWriter<W>,
    exclude: Option<&Regex>,
) -> Result<()> {
    for i in 0..src.len() {
        let mut entry = src.by_index(i)?;
        if let Some(exclude) = &exclude {
            if exclude.is_match(entry.name()) {
                continue;
            }
        }
        let mut options = FileOptions::default()
            .compression_method(entry.compression())
            .last_modified_time(entry.last_modified());
        if let Some(mode) = entry.unix_mode() {
            options = options.unix_permissions(mode);
        }
        if entry.is_dir() {
            dest.add_directory(entry.name(), options)?;
        } else {
            dest.start_file(entry.name(), options)?;
            io::copy(&mut entry, dest)?;
        }
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::io::Cursor;

    #[test]
    fn test_copy_entries() -> Result<()> {
        let mut src = mock_src()?;
        let mut dest = mock_dest()?;
        copy_entries(&mut src, &mut dest, None)?;

        let mut dest = ZipArchive::new(dest.finish()?)?;
        for i in 0..dest.len() {
            let entry = dest.by_index(i)?;
            println!("{}", entry.name());
        }
        Ok(())
    }

    fn mock_src() -> Result<ZipArchive<Cursor<Vec<u8>>>> {
        let mut writer = ZipWriter::new(Cursor::new(Vec::new()));
        let options = FileOptions::default();
        writer.add_directory("Test dir èëå/123.txt", options)?;
        writer.start_file("Test dir èëå/real\tfile", options)?;
        writer.write(b"Some cool test data lol\nhey new line")?;
        Ok(ZipArchive::new(writer.finish()?)?)
    }

    fn mock_dest() -> Result<ZipWriter<Cursor<Vec<u8>>>> {
        let mut writer = ZipWriter::new(Cursor::new(Vec::new()));
        let options = FileOptions::default();
        writer.add_directory("other dir/123.txt", options)?;
        writer.start_file("Test dir èëå/real\tfile", options)?;
        writer.write(b"Old data pls delete")?;
        writer.add_directory("stay there plsss", options)?;
        writer.start_file("stay there pls/stayyyy", options)?;
        writer.write(b"dont go away")?;
        Ok(writer)
    }
}
