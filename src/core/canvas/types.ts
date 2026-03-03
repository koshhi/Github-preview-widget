const EMBED_BLOCK_KIND = "github_file_embed";

const SYNC_STATUS = Object.freeze({
  IDLE: "idle",
  SYNCING: "syncing",
  SUCCESS: "success",
  ERROR: "error",
});

const SYNC_MODE = Object.freeze({
  MANUAL: "manual",
  AUTO: "auto",
});

const SYNC_BADGE_TONE = Object.freeze({
  [SYNC_STATUS.IDLE]: "neutral",
  [SYNC_STATUS.SYNCING]: "info",
  [SYNC_STATUS.SUCCESS]: "success",
  [SYNC_STATUS.ERROR]: "danger",
});

const REFRESH_TRIGGER = Object.freeze({
  HEADER_BUTTON: "header_button",
  CONTEXT_MENU: "context_menu",
  AUTO_OPEN: "auto_open",
});

const BLOCK_LIMITS = Object.freeze({
  DEFAULT_WIDTH: 640,
  MIN_WIDTH: 320,
  MAX_WIDTH: 1200,
  MIN_HEIGHT: 180,
});

module.exports = {
  EMBED_BLOCK_KIND,
  SYNC_STATUS,
  SYNC_MODE,
  SYNC_BADGE_TONE,
  REFRESH_TRIGGER,
  BLOCK_LIMITS,
};
