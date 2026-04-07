import Dashboard from "@/components/Dashboard";
import { Report } from "@/lib/types";
import parsedData from "../../public/parsed_data.json";

export default function Page() {
  const data = parsedData as Report[];
  return <Dashboard data={data} />;
}
