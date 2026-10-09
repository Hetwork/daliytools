import SiteHeader from "../_components/site-header";
import SiteFooter from "../_components/site-footer";
import ToolLibrary from "../_components/tool-library";
import Sculpture from "../_components/sculpture";

export default function ToolsContent() {
  return <main className="tools-page"><SiteHeader active="Tools" /><section className="collection-hero site-container" id="main-content" tabIndex={-1}><div><p className="eyebrow">YOUR EVERYDAY DIGITAL TOOLKIT</p><h1>Less busywork.<br /><span>More possibilities.</span></h1><p>From the first edit to the final export. Find the right tool<br className="desktop-break" /> for whatever your day has in store.</p></div><Sculpture compact /></section><section className="site-container collection-library"><ToolLibrary full /></section><SiteFooter /></main>;
}
