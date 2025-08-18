"use client"
import React, {useRef, useEffect, useCallback} from 'react';
import Editor, {type Monaco} from '@monaco-editor/react';
import { TemplateFile } from '../types';
import {configureMonaco, getEditorLanguage, defaultEditorOptions} from './EditorConfig';

interface PlaygroundEditorProps {
    activeFile: TemplateFile |undefined;
    content: string;
    onContentChange: (value: string) => void;
}

const PlaygroundEditor = ({activeFile, content, onContentChange}: PlaygroundEditorProps) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const editorRef = useRef<any>(null);
    const monacoRef = useRef<Monaco>(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleEditorDidMount = (editor: any, monaco: Monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;
        configureMonaco(monaco);
        updateEditorLanguage();
    }

    const updateEditorLanguage = ()=>{
        if(!activeFile || !monacoRef.current || !editorRef.current) return;
        const model = editorRef.current.getModel();
        if(model) return;
        const language  = getEditorLanguage(activeFile.fileExtension || "");
        try {
            monacoRef.current.editor.setModelLanguage(model, language);
        } catch (error) {
            console.error("Error updating editor language:", error);
        }
    }

    useEffect(()=>{
        updateEditorLanguage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[activeFile]);
    return <div className='h-full relative'>
        <Editor
        height="100%"
        value={content}
        onChange={(value)=>onContentChange(value || "")}
        onMount={handleEditorDidMount}
        language={activeFile?getEditorLanguage(activeFile.fileExtension || ""):"plaintext"}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        options={defaultEditorOptions}
        />
    </div>
}

export default PlaygroundEditor