import { adminNavItems } from "../../utils/constants"
import SettingListItem from "./SettingListItem"

function SettingList() {
    return (
        <ul className="col-span-2 mx-1 mb-4 border-4 rounded-2xl border-beige">
            {adminNavItems.map((item) => (
                <SettingListItem key={item.path} item={item} />
            ))}
        </ul>
    )
}

export default SettingList