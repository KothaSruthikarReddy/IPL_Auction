const sounds: Record<string, HTMLAudioElement> = {
  bid: new Audio('/sounds/bid.mp3'),
  sold: new Audio('/sounds/sold.mp3'),
  unsold: new Audio('/sounds/unsold.mp3'),
  warning: new Audio('/sounds/warning.mp3'),
  expired: new Audio('/sounds/expired.mp3')
};

export const playSound = (name: keyof typeof sounds) => {
  const sound = sounds[name];
  sound.currentTime = 0;
  sound.play().catch(() => undefined);
};
