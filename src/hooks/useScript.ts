import {useEffect, useState} from 'react';

const useScript = (url: string, crossOrigin?: string, integrity?: string): any => {

    const [script, setScript] = useState<any>();

    useEffect(() => {
        const script = document.createElement('script');

        script.src = url;
        script.async = true;
        script.crossOrigin = crossOrigin ? crossOrigin : null;
        script.integrity = integrity ? integrity : "";

        setScript(script);

        return () => {
            document.body.removeChild(script);
            setScript(null);
        }
    }, [url]);

    return script;
};

export default useScript;