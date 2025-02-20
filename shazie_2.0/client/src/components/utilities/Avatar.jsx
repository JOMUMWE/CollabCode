export default function Avatar(props) {
  console.log(props.length);
  return (
    <div className="avatar-group -space-x-6">
      <div className="avatar">
        <div className="w-10">
          <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
      </div>
      <div className="avatar">
        <div className="w-10">
          <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
      </div>
      <div className="avatar">
        <div className="w-10">
          <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
      </div>
      {props.length > 3 ? (
        <div className="avatar avatar-placeholder">
          <div className="bg-neutral text-neutral-content w-10">
            <span>+{props.length - 3}</span>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
