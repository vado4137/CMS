export const FACTION_PERMISSIONS = {
    MANAGE_FACTION: "Allgemeine Fraktions-Einstellungen verwalten",
    MANAGE_MEMBERS: "Mitglieder verwalten (Einstellen/Befördern/Kündigen)",
    MANAGE_RANKS: "Ränge und Rechte bearbeiten",
    MANAGE_FULL_RANKS: "Ränge und Rechte Erstellen/Bearbeiten/Löschen",
    MANAGE_DEPARTMENTS: "Abteilungen verwalten",
    MANAGE_LOCATIONS: "Standorte verwalten",
    VIEW_LOGS: "Interne Fraktions-Logs einsehen",
    MANAGE_RECRUITING: "Bewerbungen verwalten",
    MANAGE_SETTINGS: "Einstellungen verwalten",
    MANAGE_TRAINING: "Darf Ausbildungen anfragen",
    MANAGE_TRAININGTYPES: "Ausbildungstypen verwalten",
    ACCEPT_TRAINING: "Darf Ausbildungen annehmen",
    VIEW_TRAINING: "Darf Ausbildungen einsehen",
    VIEW_CALENDAR: "Darf den Kalender einsehen",
    CREATE_ABSENCES: "Darf Abwesenheiten erstellen",
    CREATE_EVENTS: "Darf Events(Training, Ausbildung, etc.) erstellen",
    VIEW_EVENTS: "Darf Events(Training, Ausbildung, etc.) einsehen",
    VIEW_DOCUMENTS: "Darf Dokumente(forum strucktur) einsehen",
    MANAGE_DOCUMENTS: "Darf Dokumente(Ganzes Forum) erstellen/bearbeiten/löschen",
  } as const;
  
  export type PermissionKey = keyof typeof FACTION_PERMISSIONS;