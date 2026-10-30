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
    controls: 'Input controls and test',
    close: 'Close controls',
    keys: 'Physical keyboard keys',
    key: 'Key',
    conflict:
      'Choose different physical keys / device buttons for the two players.',
    keyHelp:
      'Left and right Shift are separate physical keys. Other labels refer to physical positions, not the printed character. Release before pressing again.',
    devices: 'Gamepads',
    unsupported: 'Gamepad API unavailable. Use keyboard or touch.',
    denied:
      'Gamepad access failed. Check browser permissions; use keyboard or touch.',
    connect:
      'Connect a controller and press a button to make it visible. No device is assigned automatically.',
    disconnected:
      'Assigned controller disconnected. Save game, exit, reassign in Options, then import your saved game.',
    none: 'Not assigned',
    device: 'Controller',
    button: 'Button index (starting at 0)',
    assign: 'Assign controller button',
    assignmentError:
      'Select a connected controller and an existing button index (starting at 0).',
    test: 'Safe input test — no field can be awarded here.',
    testIdle: 'Press and release each assigned input.',
    pressed: 'Pressed',
    released: 'Released / ready',
    rearm: 'Release / rearm required',
    buzzer: 'Touch buzzer',
    touchHelp:
      'Two players may touch separate A/B buzzers simultaneously. Hold is ignored; lift your finger before buzzing again. Use keyboard or touch unless controllers are explicitly assigned.',
    mappingError:
      'Keyboard preferences could not be saved. Existing data is preserved; mappings work for this session. Allow storage and change a mapping again to retry.',
    mappingReadError:
      'Keyboard preferences could not be read or validated. Original data is protected; the displayed keys work only in this session. Enable storage and reload before retrying. Keep the original hexy.inputs.v1 record before repairing an invalid/newer format.',
    fairness:
      'Inputs within 8 ms replay as ties. Browser event timing and polled controllers are not perfectly fair across devices; prefer the same input type for both players.',
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
    controls: 'Ovládání a test vstupů',
    close: 'Zavřít ovládání',
    keys: 'Fyzické klávesy',
    key: 'Klávesa',
    conflict:
      'Vyberte pro oba hráče různé fyzické klávesy / tlačítka ovladače.',
    keyHelp:
      'Levý a pravý Shift jsou samostatné fyzické klávesy. Ostatní názvy označují fyzickou pozici, ne vytištěný znak. Před dalším stiskem uvolněte.',
    devices: 'Herní ovladače',
    unsupported: 'Gamepad API není dostupné. Použijte klávesnici nebo dotyk.',
    denied:
      'Přístup k ovladačům selhal. Zkontrolujte oprávnění prohlížeče; použijte klávesnici nebo dotyk.',
    connect:
      'Připojte ovladač a stiskněte tlačítko, aby byl viditelný. Žádný ovladač se nepřiřazuje automaticky.',
    disconnected:
      'Přiřazený ovladač byl odpojen. Uložte a ukončete hru, přiřaďte ovladač v Možnostech a importujte uloženou hru.',
    none: 'Nepřiřazeno',
    device: 'Ovladač',
    button: 'Číslo tlačítka (od 0)',
    assign: 'Přiřadit tlačítko ovladače',
    assignmentError:
      'Vyberte připojený ovladač a existující číslo tlačítka (od 0).',
    test: 'Bezpečný test vstupů — zde nelze získat pole.',
    testIdle: 'Stiskněte a uvolněte každý přiřazený vstup.',
    pressed: 'Stisknuto',
    released: 'Uvolněno / připraveno',
    rearm: 'Nutné uvolnění / obnovení',
    buzzer: 'Dotykové tlačítko',
    touchHelp:
      'Dva hráči mohou současně stisknout samostatná tlačítka A/B. Držení se ignoruje; před dalším stiskem zvedněte prst. Bez výslovného přiřazení ovladačů použijte klávesnici nebo dotyk.',
    mappingError:
      'Předvolby kláves nelze uložit. Původní data zůstávají; přiřazení platí pro tuto relaci. Povolte úložiště a dalším přiřazením klávesy opakujte uložení.',
    mappingReadError:
      'Předvolby kláves nelze načíst nebo ověřit. Původní data jsou chráněná; zobrazené klávesy platí jen v této relaci. Povolte úložiště a před další úpravou obnovte stránku. Před opravou neplatného/novějšího formátu zachovejte původní záznam hexy.inputs.v1.',
    fairness:
      'Vstupy do 8 ms znamenají nerozhodný výsledek a opakování. Časování událostí a dotazování ovladačů není mezi zařízeními dokonale spravedlivé; oba hráči by měli použít stejný typ vstupu.',
  },
};

/** @typedef {typeof deviceStrings.en} DeviceTexts */
