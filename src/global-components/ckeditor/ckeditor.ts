import {Ref, UnwrapRef, watch} from "vue";

export interface CkeditorElement extends HTMLDivElement {
  CKEditor: any;
}

export type CkeditorProps = {
  modelValue: string;
  config?: any;
  disabled?: boolean;
  refKey?: string;
};

export type CkeditorEmit = {
  (e: "update:modelValue", value: string): void;
  (e: "focus", value: string, editor: any): void;
  (e: "blur", value: string, editor: any): void;
  (e: "ready", editor: string): void;
};

const init = async (
  el: CkeditorElement,
  editorBuild: any,
  {
    props,
    emit,
    cacheData,
  }: {
    props: CkeditorProps;
    emit: CkeditorEmit;
    cacheData: Ref<UnwrapRef<string>>;
  }
) => {
  // Initial data
  cacheData.value = props.modelValue;
  props.config.initialData = props.modelValue;

  // Init CKEditor
  const editor = await editorBuild.create(el, props.config);

  // Attach CKEditor instance
  el.CKEditor = editor;

  watch(() => props.modelValue, (val) => {
    if (val) {
      updateData(el, { props, cacheData });
    }
  })

  // Set initial disabled state
  props.disabled && editor.enableReadOnlyMode("ckeditor");

  // Set on change event
  editor.model.document.on("change:data", () => {
    const data = editor.getData();
    cacheData.value = data;
    emit("update:modelValue", data);
  });

  // Set on focus event
  editor.editing.view.document.on("focus", (evt: any) => {
    emit("focus", evt, editor);
  });

  // Set on blur event
  editor.editing.view.document.on("blur", (evt: any) => {
    emit("blur", evt, editor);
  });

  // Set upload complete
  // const imageUploadEditing = editor.plugins.get( 'ImageUploadEditing' );
  //
  // imageUploadEditing.on( 'uploadComplete', ( evt, { data, imageElement } ) => {
  //   editor.model.change( writer => {
  //     writer.setAttribute( 'crossOrigin', 'anonymous', imageElement );
  //   } );
  // });
  //
  // editor.model.schema.extend( 'imageBlock', { allowAttributes: 'crossOrigin' } );
  //
  // editor.conversion.for( 'upcast' ).attributeToAttribute( {
  //   view: 'crossOrigin',
  //   model: 'crossOrigin'
  // } );
  //
  // editor.conversion.for( 'downcast' ).add( dispatcher => {
  //   dispatcher.on( 'attribute:crossOrigin:imageBlock', ( evt, data, conversionApi ) => {
  //     if ( !conversionApi.consumable.consume( data.item, evt.name ) ) {
  //       return;
  //     }
  //
  //     const viewWriter = conversionApi.writer;
  //     const figure = conversionApi.mapper.toViewElement( data.item );
  //     const img = figure.getChild( 0 );
  //
  //     if ( data.attributeNewValue !== null ) {
  //       viewWriter.setAttribute( 'crossOrigin', data.attributeNewValue, img );
  //     } else {
  //       viewWriter.removeAttribute( 'crossOrigin', img );
  //     }
  //   } );
  // } );

  // Set on ready event
  emit("ready", editor);
};

// Watch model change
const updateData = (
  el: CkeditorElement,
  {
    props,
    cacheData,
  }: {
    props: CkeditorProps;
    cacheData: Ref<UnwrapRef<string>>;
  }
) => {
  if (cacheData.value !== props.modelValue) {
    el.CKEditor.setData(props.modelValue);
  }
};

export { init, updateData };
