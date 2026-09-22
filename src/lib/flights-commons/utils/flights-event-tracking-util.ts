import { NucleiLogger } from "@CDNA-Technologies/svelte-vitals/logger";
import { StringUtils } from "@CDNA-Technologies/svelte-vitals/util";
import { NucleiAnalyticsEvent } from "@CDNA-Technologies/svelte-vitals/analytics";
import { trackCustomEvent } from "@CDNA-Technologies/svelte-vitals/native-bridge-util";


export class SmartEvent {
  static NA: string = 'NA';
  static BACK: string = 'BACK';
  static PROCEED: string = 'PROCEED';
  static RECENT_SEARCHES: string = 'RECENT_SEARCHES';
}

export class FlightsEventTracking {

}
