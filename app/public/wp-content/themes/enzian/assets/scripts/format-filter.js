(function (wp) {
    const { registerFormatType, toggleFormat } = wp.richText;
    const { RichTextToolbarButton } = wp.blockEditor;
    const { createElement: el } = wp.element;

    console.log('Registering toSansSerif format type');

    registerFormatType('enzian/to-sans-serif', {
        title: 'toSansSerif',
        tagName: 'span',
        className: 'toSansSerif',
        edit: function ({ isActive, value, onChange }) {
            return el(RichTextToolbarButton, {
                icon: 'editor-code',
                title: 'Eigene Klasse anwenden',
                onClick: function () {
                    onChange(
                        toggleFormat(value, {
                            type: 'enzian/to-sans-serif',
                        })
                    );
                },
                isActive: isActive,
            });
        },
    });
})(window.wp);