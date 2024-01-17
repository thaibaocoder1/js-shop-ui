/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function (config) {
  config.filebrowserBrowseUrl = "public/js/plugins/ckfinder/ckfinder.html";
  config.filebrowserUploadUrl =
    "ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files";
};
