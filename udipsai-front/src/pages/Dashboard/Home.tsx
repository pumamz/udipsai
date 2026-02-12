import DashboardResume from "../../components/common/DashboardResume";
import PageMeta from "../../components/common/PageMeta";
import CalendarBox from "../../components/common/CalendarBox";

export default function Home() {
  return (
    <>
      <PageMeta
        title="UDIPSAI - Dashboard"
        description="Dashboard de UDIPSAI"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <DashboardResume />
        </div>
        <div className="col-span-12">
          <CalendarBox />
        </div>
      </div>
    </>
  );
}
