export const deviceStrings = {
  en: {
    recovery: 'Game recovery',
    saved: 'Current game saved locally. Export is your backup.',
    unsaved: 'Current game is not saved.',
    unsavedShort: 'Not saved',
    recoveryHelp:
      'The original stored game has not been replaced. Export it before discarding; retry after allowing storage or restoring the clock. A newer format needs a compatible HexY version.',
    exportGame: 'Export game / original save',
    exportOriginal: 'Export protected original save',
    importGame: 'Import saved game JSON',
    retryRecovery: 'Retry recovery / saving',
    discardSave: 'Discard stored game…',
    controls: 'Duel controls',
    record: 'Record',
    recording:
      'Release, then press a key or controller button. Escape cancels.',
    cancelRecord: 'Cancel recording',
    reserved:
      'Use a letter, digit, punctuation, Shift, Space or numpad key. Navigation and browser shortcuts are reserved.',
    leftShift: 'Left Shift',
    rightShift: 'Right Shift',
    space: 'Space',
    rebind: 'Record again',
    close: 'Close controls',
    key: 'Key',
    conflict:
      'Choose different physical keys / device buttons for the two players.',
    unsupported: 'Gamepad API unavailable. Use keyboard or touch.',
    denied:
      'Gamepad access failed. Check browser permissions; use keyboard or touch.',
    disconnected: 'Controller disconnected. Record again or use touch.',
    device: 'Controller',
    button: 'Button',
    assignmentError:
      'Release, then press a button on a connected controller again.',
    pressed: 'Pressed',
    released: 'Released / ready',
    rearm: 'Release / rearm required',
    buzzer: 'Touch buzzer',
    mappingError:
      'Controls could not be saved. Existing data is preserved; bindings work for this session. Allow storage and record again to retry.',
    mappingReadError:
      'Controls could not be read or validated. Original data is protected; displayed bindings work for this session. Enable storage and reload before retrying. Keep the hexy.inputs.v1 record before repairing an invalid/newer format.',
  },
  cs: {
    recovery: 'Obnovení hry',
    saved: 'Aktuální hra je uložena místně. Zálohou je export.',
    unsaved: 'Aktuální hra není uložena.',
    unsavedShort: 'Neuloženo',
    recoveryHelp:
      'Původní uložená hra nebyla nahrazena. Před smazáním ji exportujte; po povolení úložiště nebo opravě hodin opakujte obnovení. Novější formát vyžaduje kompatibilní verzi HexY.',
    exportGame: 'Exportovat hru / původní záznam',
    exportOriginal: 'Exportovat chráněný původní záznam',
    importGame: 'Importovat uloženou hru JSON',
    retryRecovery: 'Opakovat obnovení / uložení',
    discardSave: 'Smazat uloženou hru…',
    controls: 'Ovládání duelů',
    record: 'Nahrát',
    recording:
      'Uvolněte vstupy a stiskněte klávesu nebo tlačítko. Escape zruší nahrávání.',
    cancelRecord: 'Zrušit nahrávání',
    reserved:
      'Použijte písmeno, číslici, interpunkci, Shift, mezerník nebo numerickou klávesu. Navigace a zkratky prohlížeče jsou vyhrazené.',
    leftShift: 'Levý Shift',
    rightShift: 'Pravý Shift',
    space: 'Mezerník',
    rebind: 'Znovu nahrajte',
    close: 'Zavřít ovládání',
    key: 'Klávesa',
    conflict:
      'Vyberte pro oba hráče různé fyzické klávesy / tlačítka ovladače.',
    unsupported: 'Gamepad API není dostupné. Použijte klávesnici nebo dotyk.',
    denied:
      'Přístup k ovladačům selhal. Zkontrolujte oprávnění prohlížeče; použijte klávesnici nebo dotyk.',
    disconnected:
      'Ovladač byl odpojen. Znovu nahrajte ovládání nebo použijte dotyk.',
    device: 'Ovladač',
    button: 'Tlačítko',
    assignmentError:
      'Uvolněte a znovu stiskněte tlačítko připojeného ovladače.',
    pressed: 'Stisknuto',
    released: 'Uvolněno / připraveno',
    rearm: 'Nutné uvolnění / obnovení',
    buzzer: 'Dotykové tlačítko',
    mappingError:
      'Ovládání nelze uložit. Původní data zůstávají; přiřazení platí pro tuto relaci. Povolte úložiště a nahrání opakujte.',
    mappingReadError:
      'Ovládání nelze načíst nebo ověřit. Původní data jsou chráněná; zobrazené přiřazení platí jen v této relaci. Povolte úložiště a obnovte stránku. Před opravou neplatného/novějšího formátu zachovejte záznam hexy.inputs.v1.',
  },
};

/** @typedef {typeof deviceStrings.en} DeviceTexts */
