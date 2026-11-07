import Link from "next/link";
import { ArrowLeft, Upload, UserRound } from "lucide-react";
import { DeleteAccountDialog } from "@/components/account/delete-account-dialog";
import { mockUser } from "@/lib/mock-user";

export default function AccountPage() {
  return (
    <main className="app-screen information-screen account-screen">
      <div className="detail-page-title">
        <Link aria-label="Back to settings" href="/settings">
          <ArrowLeft aria-hidden="true" />
        </Link>
        <h1>Account</h1>
      </div>
      <div className="account-avatar-wrap">
        <div className="account-avatar-large">
          <UserRound aria-hidden="true" />
        </div>
        <button
          aria-label="Change profile photo"
          className="account-avatar-upload"
          type="button"
        >
          <Upload aria-hidden="true" />
        </button>
      </div>
      <section className="account-fields">
        <div className="account-field">
          <h2>Surname</h2>
          <p>{mockUser.surname}</p>
        </div>
        <div className="account-field">
          <h2>First name</h2>
          <p>{mockUser.firstName}</p>
        </div>
        <div className="account-field">
          <h2>School</h2>
          <p>{mockUser.school}</p>
        </div>
        <div className="account-field">
          <h2>Department</h2>
          <p>{mockUser.department}</p>
        </div>
      </section>
      <DeleteAccountDialog />
    </main>
  );
}
