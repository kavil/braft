import React, { useState, useRef } from "react";
import BraftEditor, { ControlType, EditorState } from "braft-editor";
import { ContentUtils } from "braft-utils";
import "braft-editor/dist/index.css";
import { Upload } from "antd";
import ReactDOM from "react-dom";

type InputType = {
  value?: string;
  onChange?: (value: string) => void;
};

export const InputEditor: React.FC<InputType> = ({ value, onChange }) => {
  const [editorState, setEditorState] = useState(
    BraftEditor.createEditorState(511)
  );
  const editorInstance = useRef(null);

  const onEditorStateChange = (es) => {
    setEditorState(es);
    // console.log(es);
    let html = es.toHTML();
    // console.log(html);

    if (html === "<p></p>") {
      html = "";
    }
    onChange && onChange(html);
  };

  const uploadHandler = (param) => {
    if (!param.file) {
      return false;
    }

    const reader = new FileReader();
    reader.readAsDataURL(param.file);
    reader.addEventListener(
      "load",
      () => {
        const es = ContentUtils.insertMedias(editorState, [
          {
            type: "IMAGE",
            url: reader.result
          }
        ]);
        setEditorState(es);
        console.log(es);
      },
      false
    );
  };

  const controls: ControlType[] = [
    "undo",
    "redo",
    "separator",
    "headings",
    "font-size",
    "bold",
    "italic",
    "remove-styles",
    "separator",
    "media",
    {
      key: "img",
      type: "component",
      component: (
        <div
          className="control-item button upload-img-button"
          data-title="插入图片"
        >
          <Upload
            accept="image/*"
            showUploadList={false}
            customRequest={uploadHandler}
          >
            +
          </Upload>
        </div>
      )
    },
    "text-color",
    "link",
    "blockquote",
    "code",
    "clear"
  ];

  return (
    <BraftEditor
      className="input-edit"
      ref={editorInstance}
      value={editorState}
      onChange={onEditorStateChange}
      controls={controls}
    />
  );
};

ReactDOM.render(
  <div>
    <InputEditor onChange={(value) => console.log(555)} />
  </div>,
  document.getElementById("container")
);
