#pragma once
#include <GF/Extensions/Bridges/ExtensionHostBridgeImpl.hxx>
#include "generated/GeneratedProcessorsManifest.hpp"

namespace ExtensionHost::impl {

	struct ExtensionHostImpl : GF::Extensions::impl::ExtensionHostImplBase {
		ExtensionHostImpl() : ExtensionHostImplBase()
		{
			GFExtensionsPyTorchGenerated::ForEachProcessor([this]<typename TProcessor>() {
				this->template Add<TProcessor>();
			});
		}
	};
}