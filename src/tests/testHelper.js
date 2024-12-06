import usersDb from "../db/repositories/users.js";
import notificationsDb from "../db/repositories/notifications.js";

const emptyDatabase = async () => {
  await Promise.all([
    notificationsDb.deleteAllNotifications(),
    usersDb.deleteAllUsers(),
  ]);
};

export default { emptyDatabase };
