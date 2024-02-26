interface Props {
  avatarURL?: string;
  uploadedAvatar: {
    imageUrl?: string;
    publicID?: string;
  };
}

export function useProfileAvatar(avatar: Props | undefined) {
  if (avatar) {
    if (avatar.avatarURL) return avatar.avatarURL;
    else if (avatar.uploadedAvatar.imageUrl && avatar.uploadedAvatar.publicID) {
      return avatar.uploadedAvatar.imageUrl;
    } else return "";
  } else return "";
}
